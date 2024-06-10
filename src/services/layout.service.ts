import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { SortOptionsContract } from '@contracts/sort-options-contract';
import { LayoutModel } from '@models/layout-model';
import { Pagination } from '@models/pagination';
import { LayoutPopupComponent } from '@modules/landing-page/popupss/layout-popup/layout-popup.component';
import { CastResponseContainer } from 'cast-response';
import { Observable, tap } from 'rxjs';
import { EmployeeService } from './employee.service';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => LayoutModel,
    },
  },
  $default: {
    model: () => LayoutModel,
  },
})
@Injectable({
  providedIn: 'root',
})
export class LayoutService extends BaseCrudWithDialogService<
  LayoutPopupComponent,
  LayoutModel
> {
  serviceName = 'LayoutService';
  private _employeeService = inject(EmployeeService);

  layoutsMap: Record<number, LayoutModel> = {};

  private _layouts = signal<LayoutModel[]>([]);
  layouts = computed(() => this._layouts());

  private _currentLayout = signal<LayoutModel | undefined>(undefined);
  currentLayout = computed(() => this._currentLayout());

  protected getModelClass(): Constructor<LayoutModel> {
    return LayoutModel;
  }

  protected getModelInstance(): LayoutModel {
    return new LayoutModel();
  }

  getDialogComponent(): ComponentType<LayoutPopupComponent> {
    return LayoutPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LAYOUT;
  }

  override load(
    options?: FetchOptionsContract,
    criteria?: Partial<LayoutModel> | undefined,
    sortOptions?: SortOptionsContract | undefined,
  ): Observable<Pagination<LayoutModel[]>> {
    return super
      .load(
        options,
        { ...criteria, userId: this._employeeService.loggedInUserId },
        sortOptions,
      )
      .pipe(
        tap(rs => {
          this._layouts.set(rs.rs);
          this._setLayoutsMap();
          this.setCurrentLayout();
        }),
      );
  }

  setCurrentLayout(_new?: LayoutModel) {
    if (
      !_new &&
      this._currentLayout() &&
      this._layouts().filter(l => l.id === this._currentLayout()?.id).length
    )
      return;
    this._currentLayout.set(_new ?? this.layouts()[0]);
  }

  private _setLayoutsMap() {
    this.layoutsMap = this._layouts().reduce(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      {} as Record<number, LayoutModel>,
    );
  }
}
