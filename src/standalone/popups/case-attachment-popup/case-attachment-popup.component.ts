import { Component, inject, OnInit } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import {
  AbstractControl,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { MatIconModule } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { CaseAttachment } from '@models/case-attachment';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  combineLatest,
  exhaustMap,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { AttachmentTypeService } from '@services/attachment-type.service';
import { AttachmentType } from '@models/attachment-type';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { BlobModel } from '@models/blob-model';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidators } from '@validators/custom-validators';

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
    SwitchComponent,
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
    service: BaseCaseService<unknown>;
    type: 'folder' | 'offender';
    entityId: number;
  } = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  view$ = new Subject<CaseAttachment>();
  delete$ = new Subject<CaseAttachment>();
  save$: Subject<void> = new Subject<void>();
  attachments: CaseAttachment[] = [];
  displayedColumns: string[] = ['documentTitle', 'attachmentType', 'actions'];
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

  private listenToUploadFiles() {
    this.save$
      .pipe(
        exhaustMap(() => {
          if (this.data.type === 'folder') {
            return this.data.service.addBulkCaseAttachments(
              this.data.caseId,
              this.attachments,
            );
          } else if (this.data.type === 'offender') {
            return combineLatest(
              this.attachments.map(attachment => {
                return this.data.service.addOffenderAttachment(
                  this.data.entityId,
                  attachment,
                );
              }),
            );
          } else {
            return combineLatest(
              this.attachments.map(attachment => {
                return this.data.service.addCaseAttachment(
                  this.data.caseId,
                  attachment,
                );
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

  private loadAttachmentTypes(): void {
    this.attachmentTypeService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.attachmentTypes = list;
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

  private createControls() {
    const list = this.list as FormArray;
    list.clear({ emitEvent: false });
    this.attachments.forEach((item, index) => {
      list.push(
        this.fb.group({
          documentTitle: [item.documentTitle, CustomValidators.required],
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
          });
      })(index);
    });
    this.createControlsInProgress = false;
  }
}
