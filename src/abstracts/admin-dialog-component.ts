import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { Directive, inject, OnInit } from '@angular/core';
import {
  catchError,
  exhaustMap,
  filter,
  isObservable,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { LangService } from '@services/lang.service';
import { BaseModel } from '@abstracts/base-model';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { MatDialogRef } from '@angular/material/dialog';

@Directive()
export abstract class AdminDialogComponent<
    M extends BaseModel<M, BaseCrudServiceContract<M>>
  >
  extends OnDestroyMixin(class {})
  implements OnInit
{
  abstract data: CrudDialogDataContract<M>;
  model!: M;
  operation!: OperationType;
  abstract form: UntypedFormGroup;

  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  save$: Subject<void> = new Subject<void>();
  toast = inject(ToastService);
  dialogRef = inject(MatDialogRef);

  ngOnInit(): void {
    this.initPopup();
    this.buildForm();
    this.afterBuildForm();
    this.listenToSave();
  }

  protected initPopup(): void {
    this.model = this.data.model;
    this.operation = this.data.operation;
  }

  /**
   * @description to initialize/create instance of form group
   */
  abstract buildForm(): void;

  /**
   * @description to listen to the save event
   * @protected
   */
  protected listenToSave() {
    this.save$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this.beforeSave();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(filter((value) => value))
      .pipe(
        switchMap(() => {
          const result = this.prepareModel();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(
        exhaustMap((model) => {
          return model.save().pipe(
            catchError((error) => {
              this.saveFail(error);
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe((model) => {
        this.afterSave(model);
      });
  }

  protected abstract beforeSave(): Observable<boolean> | boolean;

  protected abstract prepareModel(): Observable<M> | M;

  /**
   * as of now we console log the error because we're already displaying any error came from backend to the user in dialog
   * @param error
   */
  protected saveFail(error: unknown) {
    console.log(error);
  }

  protected abstract afterSave(model: M): void;

  protected inViewMode() {
    return this.operation === OperationType.VIEW;
  }

  /**
   * @description override this method on your component to register listeners for control value changes
   * @protected
   */
  protected afterBuildForm(): void {
    // use this method to listen to any control value changes
    this.operation === OperationType.VIEW && this.form.disable();
  }
}
