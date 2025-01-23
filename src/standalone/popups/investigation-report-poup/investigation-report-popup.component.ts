import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AppIcons } from '@constants/app-icons';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InvestigationCategory } from '@enums/investigation-category';
import { OperationType } from '@enums/operation-type';
import { SummonType } from '@enums/summon-type';
import { UserClick } from '@enums/user-click';
import { Investigation } from '@models/investigation';
import { InvestigationReport } from '@models/investigation-report';
import { Offender } from '@models/offender';
import { Question } from '@models/question';
import { Witness } from '@models/witness';
import { ConfigService } from '@services/config.service';
import { DialogService } from '@services/dialog.service';
import { InvestigationReportService } from '@services/investigation-report.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CustomValidators } from '@validators/custom-validators';
import { Observable, of, Subject, tap } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { LookupService } from '@services/lookup.service';
import { AttendeeTypeEnum } from '@enums/attendee-type.enum';
import { TeamService } from '@services/team.service';
import { TeamNames } from '@enums/team-names';
import { InternalUser } from '@models/internal-user';
import { InvestigationAttendance } from '@models/investigation-attendance';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-investigation-report-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    TextareaComponent,
    MatTooltip,
    MatIcon,
    SelectInputComponent,
  ],
  providers: [DatePipe],
  templateUrl: './investigation-report-popup.component.html',
  styleUrl: './investigation-report-popup.component.scss',
  animations: [
    trigger('addRemoveQuestion', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(100%)',
        }),
        animate('150ms ease-in-out'),
      ]),
    ]),
  ],
})
export class InvestigationReportPopupComponent extends AdminDialogComponent<InvestigationReport> {
  override data: CrudDialogDataContract<
    InvestigationReport,
    {
      model: Investigation;
      offender?: Offender;
      witness?: Witness;
    }
  > = inject(MAT_DIALOG_DATA);
  datePipe = inject(DatePipe);
  dialog = inject(DialogService);
  investigationReportService = inject(InvestigationReportService);
  lookupService = inject(LookupService);
  teamService = inject(TeamService);
  employeeService = inject(EmployeeService);
  ouId = this.employeeService.getOrganizationUnit()!.id;
  override form!: UntypedFormGroup;
  attendeeTypes = this.lookupService.lookups.attendeeType;
  investigationModel = signal(this.data.extras!.model!);
  offender = signal(this.data.extras!.offender);
  witness = signal(this.data.extras!.witness);
  isOffender = signal(!!this.offender());
  isWitness = signal(!!this.witness());
  category = computed(() =>
    this.isOffender()
      ? this.investigationModel().inLegalAffairsActivity()
        ? InvestigationCategory.LEGAL_AFFAIRS_INVESTIGATION_RECORD
        : InvestigationCategory.DISCIPLINARY_COMMITTEE_INVESTIGATION_RECORD
      : this.investigationModel().inLegalAffairsActivity()
        ? InvestigationCategory.LEGAL_AFFAIRS_HEARING_TRANSCRIPT
        : InvestigationCategory.DISCIPLINARY_COMMITTEE_HEARING_TRANSCRIPT,
  );
  summonedType = computed(() =>
    this.isOffender() ? SummonType.OFFENDER : SummonType.WITNESS,
  );
  personId = computed(() => {
    return this.isOffender() ? this.offender()!.id : this.witness()!.id;
  });

  config = inject(ConfigService);
  title = computed(() => {
    return this.isOffender()
      ? this.lang.map.investigation_report
      : this.lang.map.hearing_minutes_subject;
  });
  personName = computed(() => {
    return this.isOffender()
      ? this.lang.map.offender_name
      : this.lang.map.witness_name;
  });
  personControl = new FormControl({ disabled: true, value: '' });
  investigatorCtrl = new FormControl({ disabled: true, value: '' });

  locationCtrl = new FormControl();
  attendeeCategoryCtrl = new FormControl<number | null>(null);
  attendeeCtrl = new FormControl<number | null>(null);
  qidCtrl = new FormControl('');
  attendeeNameCtrl = new FormControl('');

  creationDate = new FormControl({
    disabled: true,
    value: this.datePipe.transform(Date.now(), this.config.CONFIG.DATE_FORMAT),
  });
  date = new Date();
  createdOnCtrl = new FormControl('');
  investigators: InternalUser[] = [];
  currentLanguage = signal(this.lang.getCurrent());
  saveQuestion$: Subject<void> = new Subject<void>();
  editQuestion$ = new Subject<{ index: number; question: Question }>();

  editedQuestion = signal<undefined | { index: number; question: Question }>(
    undefined,
  );

  personNameEffect = effect(() => {
    this.currentLanguage();
    this.personControl.patchValue(
      this.isOffender()
        ? this.offender()!.getNames()
        : this.witness()!.getNames(),
    );
  });

  investigatorNameEffect = effect(() => {
    this.currentLanguage();
    this.investigatorCtrl.patchValue(this.model.creatorInfo.getNames());
  });

  questionForm = this.fb.group({
    question: [
      '',
      [CustomValidators.required, CustomValidators.maxLength(3100)],
    ],
    answer: ['', [CustomValidators.required, CustomValidators.maxLength(3100)]],
  });

  questionsList: Signal<ElementRef<HTMLUListElement> | undefined> = viewChild(
    'questionsList',
    {
      read: ElementRef,
    },
  );

  deleteQuestion$: Subject<Question> = new Subject();

  savePDF$ = new Subject<void>();
  uploadPDF$ = new Subject<File>();

  protected override _init() {
    super._init();
    this.lang.change$.subscribe(current => {
      this.currentLanguage.set(current);
    });
    this.loadInvestigatorsTeam();
    if (this.offender()) {
      this.attendeeCategoryCtrl.setValidators([CustomValidators.required]);
      this.attendeeCategoryCtrl.updateValueAndValidity();
    }
  }

  loadInvestigatorsTeam() {
    this.teamService
      .loadTeamMembers(TeamNames.Investigator, this.ouId)
      .subscribe((investigators: InternalUser[]) => {
        this.investigators = investigators;
      });
  }

  handleAttendeeTypeChange(type: unknown) {
    this.attendeeCtrl.setValidators([]);
    this.qidCtrl.setValidators([]);
    this.attendeeNameCtrl.setValidators([]);
    if (this.isOffender()) {
      if (type === AttendeeTypeEnum.External) {
        this.qidCtrl.setValidators([CustomValidators.required]);
        this.attendeeNameCtrl.setValidators([CustomValidators.required]);
      } else {
        this.attendeeCtrl.setValidators([CustomValidators.required]);
      }
    }
    this.attendeeCtrl.updateValueAndValidity();
    this.qidCtrl.updateValueAndValidity();
    this.attendeeNameCtrl.updateValueAndValidity();
  }

  override _buildForm(): void {
    if (this.inViewMode()) {
      this.locationCtrl.disable();
      this.attendeeCategoryCtrl.disable();
      this.attendeeCtrl.disable();
      this.qidCtrl.disable();
      this.attendeeNameCtrl.disable();
    } else {
      this.locationCtrl.enable();
      this.attendeeCategoryCtrl.enable();
      this.attendeeCtrl.enable();
      this.qidCtrl.enable();
      this.attendeeNameCtrl.enable();
    }
    this.locationCtrl.patchValue(this.model.location!);
    this.model.attendanceList[0] &&
      this.attendeeCategoryCtrl.patchValue(
        this.model.attendanceList[0].category,
      );
    this.model.attendanceList[0] &&
      this.attendeeCtrl.patchValue(this.model.attendanceList[0].attendeeId);
    this.model.attendanceList[0] &&
      this.qidCtrl.patchValue(this.model.attendanceList[0].qid);
    this.model.attendanceList[0] &&
      this.attendeeNameCtrl.patchValue(
        this.model.attendanceList[0].attendeeName,
      );
    this.listenToSaveQuestion();
    this.listenToEditQuestion();
    this.listenToDeleteQuestion();
    this.listenToSavePDF();
    this.listenToUploadPDF();
    this.form = this.fb.group({}); // just to not throw error while opening the popup on view mode
  }

  protected override _beforeSave(): boolean | Observable<boolean> {
    if (!this.model.detailsList.length) {
      this.dialog.error(
        this.lang.map.need_questions_and_answers_to_take_this_action,
      );
    }
    this.createdOnCtrl.setValue(this.date.toISOString());
    this.attendeeCategoryCtrl.markAsTouched();
    return (
      !!this.model.detailsList.length &&
      this.attendeeCtrl.valid &&
      this.qidCtrl.valid &&
      this.attendeeNameCtrl.valid &&
      this.attendeeCategoryCtrl.valid
    );
  }

  protected override _prepareModel():
    | InvestigationReport
    | Observable<InvestigationReport> {
    const attendanceObj: Partial<InvestigationAttendance> =
      new InvestigationAttendance().clone<InvestigationAttendance>({
        attendeeId: this.attendeeCtrl.getRawValue() as unknown as number,
        attendeeName: this.attendeeNameCtrl.getRawValue() as string,
        qid: this.qidCtrl.getRawValue() as string,
        category: this.attendeeCategoryCtrl.getRawValue() as unknown as number,
        createdOn: this.createdOnCtrl.value!,
      });
    !this.attendeeCategoryCtrl && delete attendanceObj.category;
    !this.qidCtrl && delete attendanceObj.qid;
    !this.attendeeNameCtrl && delete attendanceObj.attendeeName;
    !this.attendeeCtrl && delete attendanceObj.attendeeId;
    return new InvestigationReport().clone<InvestigationReport>({
      ...this.model,
      category: this.category(),
      caseId: this.investigationModel().id,
      summonedType: this.summonedType(),
      summonedId: this.personId(),
      location: this.locationCtrl.getRawValue()!,
      attendanceList: this.attendeeCategoryCtrl.value
        ? [attendanceObj as InvestigationAttendance]
        : [],
      createdOn: this.createdOnCtrl.value!,
    });
  }

  private prepareQuestionModel(): Question {
    return new Question().clone<Question>({
      ...this.questionForm.getRawValue(),
    });
  }

  protected override _afterSave(model: InvestigationReport): void {
    this.model = new InvestigationReport().clone<InvestigationReport>({
      ...model,
      creatorInfo: this.model.creatorInfo,
    });
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({
        x: this.isOffender()
          ? this.lang.map.investigation_records
          : this.lang.map.hearing_minutes_subject,
      }),
    );
  }

  private listenToSaveQuestion() {
    this.saveQuestion$
      .pipe(takeUntil(this.destroy$))
      .pipe(map(() => this.questionForm.valid))
      .pipe(
        tap(value => {
          !value &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ) &&
            this.questionForm.markAllAsTouched();
        }),
      )
      .pipe(filter(value => value))
      .pipe(map(() => this.prepareQuestionModel()))
      .subscribe(question => {
        this.model.detailsList = this.editedQuestion()
          ? this._insertAtIndex(
              this.model.detailsList,
              question,
              this.editedQuestion()!.index,
            )
          : [...this.model.detailsList, question];
        this.questionForm.reset();

        !this.editedQuestion() &&
          setTimeout(() => {
            const element = this.questionsList()?.nativeElement;
            element &&
              element.scrollTo({
                top: element?.scrollHeight,
                behavior: 'smooth',
              });
          }, 200);
        this.editedQuestion.set(undefined);
      });
  }

  private listenToEditQuestion() {
    this.editQuestion$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ question, index }) => {
        let _insertionIndex = index;
        if (this.editedQuestion()) {
          this.model.detailsList = this._insertAtIndex(
            this.model.detailsList,
            this.editedQuestion()!.question,
            this.editedQuestion()!.index,
          );
          index >= this.editedQuestion()!.index && (_insertionIndex += 1);
        }
        this.model.detailsList = this._removeAtIndex(
          this.model.detailsList,
          _insertionIndex,
        );
        this.editedQuestion.set({ question, index: _insertionIndex });
        this.questionForm.setValue({
          question: question.question,
          answer: question.answer,
        });
      });
  }

  private _insertAtIndex(list: Question[], item: Question, index: number) {
    return [...list.slice(0, index), item, ...list.slice(index, list.length)];
  }

  private _removeAtIndex(list: Question[], index: number) {
    return [...list.slice(0, index), ...list.slice(index + 1, list.length)];
  }

  clearForm() {
    this.questionForm.reset();
  }

  protected readonly AppIcons = AppIcons;

  private listenToSavePDF() {
    this.savePDF$
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.model.download()))
      .pipe(
        switchMap(() => {
          return this.model.documentVsId
            ? of(this.model)
            : this.investigationReportService.loadById(this.model.id);
        }),
      )
      .subscribe(model => {
        this.model = model;
      });
  }

  private listenToDeleteQuestion() {
    this.deleteQuestion$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(question =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: this.lang.map.question,
              }),
            )
            .afterClosed()
            .pipe(map(click => ({ click, question }))),
        ),
        filter(({ click }) => click === UserClick.YES),
      )
      .subscribe(({ question }) => {
        this.model.detailsList = this.model.detailsList.filter(item => {
          return item !== question;
        });
      });
  }

  uploadChange($event: Event) {
    this.uploadPDF$.next(($event.target as HTMLInputElement).files![0]);
  }

  listenToUploadPDF(): void {
    this.uploadPDF$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(file => {
          return this.model.upload(file);
        }),
      )
      .subscribe(() => {
        this.operation = OperationType.VIEW;
        this.toast.success(this.lang.map.file_uploaded_successfully);
      });
  }

  protected readonly AttendeeTypeEnum = AttendeeTypeEnum;
}
