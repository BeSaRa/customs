import { Directive, EventEmitter, OnInit } from '@angular/core';
import { catchError, delay, exhaustMap, filter, isObservable, map, Observable, of, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { SaveTypes } from '@enums/save-types';
import { BaseCase } from '@models/base-case';
import { BaseCaseService } from '@abstracts/base-case.service';
import { BaseCaseContract } from '@contracts/base-case-contract';
import { ignoreErrors } from '@utils/utils';
import { OperationType } from '@enums/operation-type';
import { AppIcons } from '@constants/app-icons';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';

@Directive({})
export abstract class BaseCaseComponent<Model extends BaseCase<BaseCaseService<Model>, Model>, Service>
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly AppIcons = AppIcons;
  protected readonly SaveTypes = SaveTypes;
  abstract form: UntypedFormGroup;
  abstract service: Service;
  abstract model: Model;
  save$ = new Subject<SaveTypes>();
  afterSave$ = new EventEmitter<{ model: Model; saveType: SaveTypes }>();
  operation = OperationType.CREATE;
  private saveMap: Record<SaveTypes, keyof BaseCaseContract<Model>> = {
    [SaveTypes.COMMIT]: 'commit',
    [SaveTypes.DRAFT]: 'draft',
    [SaveTypes.FINAL]: 'save',
    [SaveTypes.DRAFT_CONTINUE]: 'draft',
  };

  ngOnInit(): void {
    of(true)
      .pipe(tap(() => this._init()))
      .pipe(tap(() => this._buildForm()))
      .pipe(tap(() => this._listenToSave()))
      .pipe(delay(0))
      .pipe(tap(() => this._afterBuildForm()))
      .subscribe();
  }

  private _saveModel(model: Model, saveType: SaveTypes): Observable<{ model: Model; saveType: SaveTypes }> {
    return model[this.saveMap[saveType]]().pipe(
      map(model => ({
        model,
        saveType,
      }))
    );
  }

  private _listenToSave(): void {
    this.save$
      .pipe(
        switchMap(saveType => {
          const beforeSave = this._beforeSave(saveType);
          return isObservable(beforeSave) ? beforeSave : of(beforeSave);
        })
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const model = this._prepareModel();
          return isObservable(model) ? model : of(model);
        })
      )
      .pipe(withLatestFrom(this.save$))
      .pipe(
        exhaustMap(([model, saveType]) => {
          return this._saveModel(model, saveType)
            .pipe(
              catchError(error => {
                this._saveFail(error);
                return error;
              })
            )
            .pipe(ignoreErrors());
        })
      )
      .pipe(filter((result): result is { model: Model; saveType: SaveTypes } => !!result))
      .subscribe(({ model, saveType }) => {
        this._afterSave(model, saveType, this.operation);
        this.operation = OperationType.UPDATE;
        this._updateForm(model);
        this.afterSave$.next({ model, saveType });
      });
  }

  protected _init(): void {
    console.log('INIT');
  }

  abstract _buildForm(): void;

  abstract _afterBuildForm(): void;

  abstract _beforeSave(saveType: SaveTypes): Observable<boolean> | boolean;

  abstract _prepareModel(): Model | Observable<Model>;

  abstract _afterSave(model: Model, saveType: SaveTypes, operation: OperationType): void;

  abstract _updateForm(model: Model): void;

  protected _saveFail(error: Error): void {
    console.log('SAVE_ERROR', error);
  }
}
