import { BaseCaseService } from '@abstracts/base-case.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  Input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Config } from '@constants/config';
import { FolderType } from '@enums/folder-type.enum';
import { OperationType } from '@enums/operation-type';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { CaseAttachment } from '@models/case-attachment';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { ToastService } from '@services/toast.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { EditAttachmentNamePopupComponent } from '@standalone/popups/edit-attachment-name-popup/edit-attachment-name-popup.component';
import { ignoreErrors } from '@utils/utils';
import {
  BehaviorSubject,
  combineLatest,
  exhaustMap,
  filter,
  map,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { AttachmentType } from '@models/attachment-type';
import { AttachmentTypeService } from '@services/attachment-type.service';

@Component({
  selector: 'app-case-attachments',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    InputComponent,
    SelectInputComponent,
  ],
  templateUrl: './case-attachments.component.html',
  styleUrls: ['./case-attachments.component.scss'],
})
export class CaseAttachmentsComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly Config = Config;
  view$ = new Subject<CaseAttachment>();
  reload$ = new ReplaySubject<void>(1);
  delete$ = new Subject<CaseAttachment>();
  lang = inject(LangService);
  dialog = inject(DialogService);
  toast = inject(ToastService);
  attachmentTypeService = inject(AttachmentTypeService);
  employeeService = inject(EmployeeService);
  protected readonly FolderType = FolderType;
  caseId: InputSignal<
    string | string[] | undefined | undefined[] | (string | undefined)[]
  > = input();

  @Input()
  operation!: OperationType;
  @Input()
  folderType!: FolderType;
  @Input()
  type: 'folder' | 'offender' | 'external_grievance' | 'internal_grievance' =
    'folder';
  @Input()
  entityId!: number;
  @Input()
  disabled = false;
  @Input()
  title?: string;
  @Input()
  service!: BaseCaseService<unknown>;
  @Input()
  readonly = false;
  @Input()
  showOpinionFullSerial = false;
  attachmentTypes: AttachmentType[] = [];
  employeeNumberControl: FormControl<string> = new FormControl('', {
    nonNullable: true,
  });
  attachmentTypeControl: FormControl<number | null> = new FormControl(null);

  data: BehaviorSubject<CaseAttachment[]> = new BehaviorSubject<
    CaseAttachment[]
  >([]);
  dataSource: MatTableDataSource<CaseAttachment> =
    new MatTableDataSource<CaseAttachment>();

  displayedColumns: string[] = [
    'documentTitle',
    'attachmentType',
    'employeeNo',
    'creationDate',
    'creator',
    'actions',
  ];
  filterDisplayedColumns: string[] = [];
  constructor() {
    super();
    effect(() => {
      if (this.caseId() && this.operation !== OperationType.CREATE) {
        this.reload$.next();
      }
    });
  }

  ngOnInit(): void {
    this.listenToView();
    this.listenToDelete();
    this._load();
    this.loadAttachmentTypes();
    if (
      (this.caseId() && this.operation !== OperationType.CREATE) ||
      this.folderType === this.FolderType.OFFENDER
    ) {
      this.reload$.next();
    }
    if (this.folderType === FolderType.OFFICIAL) {
      this.displayedColumns = this.displayedColumns.filter(
        col => col !== 'documentTitle',
      );
    }
    if (this.showOpinionFullSerial) {
      this.displayedColumns = [
        this.displayedColumns[0],
        'opinionFullSerial',
        ...this.displayedColumns.slice(1),
      ];
    }
    this.setupFilterColumns();
    this.listenToFiltersChange();
  }

  setupFilterColumns() {
    this.filterDisplayedColumns = this.displayedColumns.map(
      col => `${col}Filter`,
    );
  }
  listenToFiltersChange() {
    this.employeeNumberControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
    this.attachmentTypeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }
  applyFilters() {
    const employeeNumber = this.employeeNumberControl.value.trim();
    const attachmentType = this.attachmentTypeControl.value;

    let filteredData = [...this.data.value];

    if (employeeNumber) {
      filteredData = filteredData.filter(item =>
        item.employeeNo?.toString().includes(employeeNumber),
      );
    }

    if (attachmentType) {
      filteredData = filteredData.filter(
        item => item.attachmentTypeId === attachmentType,
      );
    }
    this.dataSource.data = filteredData;
  }
  loadAttachmentTypes() {
    this.attachmentTypeService
      .loadAsLookups()
      .pipe(
        map(attachmentTypes => attachmentTypes.filter(type => type.isSystem)),
      )
      .subscribe(attachmentTypes => (this.attachmentTypes = attachmentTypes));
  }

  private _load() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          switch (this.type) {
            case 'folder':
            case 'internal_grievance':
            case 'external_grievance': {
              if (this.folderType === FolderType.OFFICIAL) {
                return combineLatest([
                  this.caseId() && (this.caseId() as unknown[])[0]
                    ? this.service.loadFolderAttachments(
                        (this.caseId() as string[])[0],
                      )
                    : of([]),
                  this.caseId() && (this.caseId() as unknown[])[1]
                    ? this.service.loadFolderAttachments(
                        (this.caseId() as string[])[1],
                      )
                    : of([]),
                ]).pipe(
                  map(docs => {
                    return docs
                      .flat()
                      .sort(
                        (a, b) =>
                          new Date(b.createdOn).getTime() -
                          new Date(a.createdOn).getTime(),
                      )
                      .filter(
                        doc =>
                          !(
                            (doc.isInvestigationReportOpinion() ||
                              doc.isAdministrativeInvestigation() ||
                              doc.isInvestigationResult()) &&
                            !doc.isApproved
                          ) &&
                          ((doc.isLegal &&
                            (doc.isExportable ||
                              this.employeeService.isLegalAffairsOrInvestigatorOrInvestigatorChief())) ||
                            (!doc.isLegal &&
                              (doc.isApproved === null || doc.isApproved))),
                      );
                  }),
                );
              } else {
                if (!this.caseId()) return of([]);
                return this.service
                  .loadFolderAttachments(this.caseId() as string)
                  .pipe(
                    map(docs =>
                      docs.filter(
                        doc =>
                          doc.isApproved === null ||
                          doc.isApproved ||
                          !doc.isExportable,
                      ),
                    ),
                  );
              }
            }
            case 'offender':
              return this.entityId
                ? this.service.getOffenderAttachments(this.entityId)
                : of([]);
            default:
              return of([]);
          }
        }),
      )
      .subscribe(data => {
        this.data.next(data);
        this.dataSource.data = data;
      });
  }

  sort($event: Sort) {
    console.log('SORT', $event);
  }

  openAddDialog() {
    if (!this.caseId() && !this.entityId) {
      this.dialog.error(this.lang.map.add_violation_first_to_take_this_action);
      return;
    }
    this.service
      .openAddAttachmentDialog(
        this.caseId() as string,
        this.service,
        this.type,
        this.entityId,
      )
      .afterClosed()
      .subscribe(() => {
        this.reload$.next();
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return item.view(this.service);
        }),
      )
      .subscribe();
  }

  private listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: item.documentTitle,
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => {
                return { userClick: userClick, item };
              }),
            );
        }),
      )
      .pipe(filter(response => response.userClick === UserClick.YES))
      .pipe(
        exhaustMap(response =>
          response.item
            .delete(this.service)
            .pipe(ignoreErrors())
            .pipe(map(() => response.item)),
        ),
      )
      .pipe(
        tap(item =>
          this.toast.success(
            this.lang.map.msg_delete_x_success.change({
              x: item.documentTitle,
            }),
          ),
        ),
      )
      .subscribe(() => this.reload$.next());
  }

  openUpdateAttachmentTitleDialog(attachment: CaseAttachment) {
    this.dialog
      .open(EditAttachmentNamePopupComponent, {
        data: {
          attachment,
          service: this.service,
          isExternal: this.type === 'external_grievance',
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => this.reload$.next());
  }

  resetDataList() {
    this.data.next([]);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
