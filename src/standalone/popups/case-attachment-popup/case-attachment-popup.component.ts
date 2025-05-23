import { Component, inject, OnInit } from '@angular/core';

import { BaseCaseService } from '@abstracts/base-case.service';
import {
  AbstractControl,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { AppIcons } from '@constants/app-icons';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { AttachmentType } from '@models/attachment-type';
import { BlobModel } from '@models/blob-model';
import { CaseAttachment } from '@models/case-attachment';
import { AttachmentTypeService } from '@services/attachment-type.service';
import { CallRequestService } from '@services/call-request.service';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { ToastService } from '@services/toast.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { updateFileName } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import {
  combineLatest,
  exhaustMap,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ScanPopupComponent } from '../scan-popup/scan-popup.component';

@Component({
  selector: 'app-case-attachment-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    MatDialogModule,
    ReactiveFormsModule,
    SelectInputComponent,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './case-attachment-popup.component.html',
  styleUrls: ['./case-attachment-popup.component.scss'],
})
export class CaseAttachmentPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialogRef = inject(MatDialogRef);
  fb = inject(UntypedFormBuilder);
  dialog = inject(DialogService);
  toast = inject(ToastService);
  data: {
    caseId: string;
    service: BaseCaseService<unknown> | unknown;
    type:
      | 'folder'
      | 'offender'
      | 'apology'
      | 'external_grievance'
      | 'internal_grievance';
    entityId: number;
  } = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  view$ = new Subject<CaseAttachment>();
  delete$ = new Subject<CaseAttachment>();
  save$: Subject<void> = new Subject<void>();
  attachments: CaseAttachment[] = [];

  get displayedColumns(): string[] {
    return this.isApologyAttachments
      ? ['documentTitle', 'actions']
      : ['documentTitle', 'attachmentType', 'actions'];
  }

  attachmentTypeService = inject(AttachmentTypeService);
  attachmentTypes: AttachmentType[] = [];
  domSanitize = inject(DomSanitizer);
  createControlsInProgress = false;
  form = this.fb.group({
    list: new FormArray([]),
  });

  protected readonly AppIcons = AppIcons;

  ngOnInit(): void {
    this.listenToUploadFiles();
    this.loadAttachmentTypes();
    this.listenToView();
    this.listenToDelete();
  }

  selectFiles($event: Event) {
    $event.preventDefault();
    Array.from(($event.target as HTMLInputElement).files || []).forEach(
      item => {
        if (!this.validFile(item)) {
          return;
        }
        this.createControlsInProgress = true;
        this.attachments = [
          ...this.attachments,
          new CaseAttachment().clone<CaseAttachment>({
            content: item,
            documentTitle: item.name,
          }),
        ];
        this.createControls();
      },
    );
  }

  filesDropped($event: DragEvent) {
    $event.preventDefault();

    if (!$event.dataTransfer) return;
    if (!$event.dataTransfer.files) return;
    Array.from($event.dataTransfer.files).forEach(item => {
      if (!this.validFile(item)) {
        return;
      }
      this.createControlsInProgress = true;
      this.attachments = [
        ...this.attachments,
        new CaseAttachment().clone<CaseAttachment>({
          content: item,
          documentTitle: item.name,
        }),
      ];
      this.createControls();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validFile(_file: File): boolean {
    return true;
  }

  validData() {
    return !this.attachments.filter(
      a => !a.attachmentTypeId || !a.documentTitle.trim(),
    ).length;
  }

  private listenToUploadFiles() {
    this.save$
      .pipe(
        tap(() => {
          return (
            this.data.type !== 'apology' &&
            !this.validData() &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            )
          );
        }),
        filter(() => {
          return this.data.type === 'apology' || this.validData();
        }),
      )
      .pipe(
        exhaustMap(() => {
          if (this.data.type === 'folder') {
            return (
              this.data.service as BaseCaseService<unknown>
            ).addBulkCaseAttachments(this.data.caseId, this.attachments);
          } else if (this.data.type === 'external_grievance') {
            return combineLatest(
              this.attachments.map(attachment => {
                return (
                  this.data.service as BaseCaseService<unknown>
                ).addExternalCaseAttachment(this.data.caseId, attachment);
              }),
            );
          } else if (this.data.type === 'internal_grievance') {
            return combineLatest(
              this.attachments.map(attachment => {
                return (
                  this.data.service as BaseCaseService<unknown>
                ).addCaseAttachment(this.data.caseId, attachment);
              }),
            );
          } else if (this.data.type === 'offender') {
            return combineLatest(
              this.attachments.map(attachment => {
                return (
                  this.data.service as BaseCaseService<unknown>
                ).addOffenderAttachment(this.data.entityId, attachment);
              }),
            );
          } else if (this.data.type === 'apology') {
            return combineLatest(
              this.attachments.map(attachment => {
                return (
                  this.data.service as CallRequestService
                ).addApologyAttachment(this.data.entityId, attachment.content);
              }),
            );
          } else {
            return combineLatest(
              this.attachments.map(attachment => {
                return (
                  this.data.service as BaseCaseService<unknown>
                ).addCaseAttachment(this.data.caseId, attachment);
              }),
            );
          }
        }),
      )
      .subscribe(() => {
        this.toast.success(
          this.lang.map.msg_save_x_success.change({
            x: this.lang.map.report_attachments,
          }),
        );
        this.dialogRef.close();
      });
  }

  get isApologyAttachments() {
    return this.data.type === 'apology';
  }

  private loadAttachmentTypes(): void {
    this.attachmentTypeService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.attachmentTypes = list.filter(attachment => !attachment.isSystem);
      });
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        switchMap(model =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: model.documentTitle,
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => {
                return {
                  userClick,
                  model,
                };
              }),
            ),
        ),
      )
      .pipe(filter(result => result.userClick === UserClick.YES))
      .pipe(
        map(({ model }) => {
          return {
            title: model.documentTitle,
            index: this.attachments.indexOf(model),
          };
        }),
      )
      .subscribe(({ index, title }) => {
        this.attachments.splice(index, 1);
        this.attachments = [...this.attachments];
        (this.list as FormArray).removeAt(index);
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: title }),
        );
      });
  }

  private listenToView() {
    this.view$
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(ViewAttachmentPopupComponent, {
              data: {
                model: new BlobModel(
                  model.content as unknown as Blob,
                  this.domSanitize,
                ),
                title: model.documentTitle,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  get list(): AbstractControl {
    return this.form.get('list') as FormControl;
  }

  openScanPopup() {
    this.dialog
      .open<ScanPopupComponent, void, File[]>(ScanPopupComponent)
      .afterClosed()
      .pipe(filter(files => !!files))
      .subscribe(files => {
        files!.forEach(file => {
          this.createControlsInProgress = true;
          this.attachments = [
            ...this.attachments,
            new CaseAttachment().clone<CaseAttachment>({
              content: file,
              documentTitle: file.name,
            }),
          ];
          this.createControls();
        });
      });
  }

  private createControls() {
    const list = this.list as FormArray;
    list.clear({ emitEvent: false });
    this.attachments.forEach((item, index) => {
      list.push(
        this.fb.group({
          documentTitle: [
            { value: item.documentTitle, disabled: this.isApologyAttachments },
            CustomValidators.required,
          ],
          attachmentTypeId: [item.attachmentTypeId, CustomValidators.required],
        }),
      );
      (i => {
        (
          list.controls.at(index) as UntypedFormGroup
        ).controls.attachmentTypeId.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(value => {
            this.attachments[i].attachmentTypeId = value;
          });
        (
          list.controls.at(index) as UntypedFormGroup
        ).controls.documentTitle.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(value => {
            this.attachments[i].documentTitle = value;
            if (this.attachments[i].content) {
              this.attachments[i].content = updateFileName(
                this.attachments[i].content!,
                value,
              );
            }
          });
      })(index);
    });
    this.createControlsInProgress = false;
  }
}
