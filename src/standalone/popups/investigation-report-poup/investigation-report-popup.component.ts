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
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { InvestigationReport } from '@models/investigation-report';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Observable, Subject, tap } from 'rxjs';
import { Offender } from '@models/offender';
import { Witness } from '@models/witness';
import { InputComponent } from '@standalone/components/input/input.component';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Question } from '@models/question';
import { CustomValidators } from '@validators/custom-validators';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogService } from '@services/dialog.service';
import { MatTooltip } from '@angular/material/tooltip';
import { InvestigationCategory } from '@enums/investigation-category';
import { SummonType } from '@enums/summon-type';
import { OperationType } from '@enums/operation-type';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { UserClick } from '@enums/user-click';

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
      caseId: string;
      offender?: Offender;
      witness?: Witness;
    }
  > = inject(MAT_DIALOG_DATA);
  datePipe = inject(DatePipe);
  dialog = inject(DialogService);
  override form!: UntypedFormGroup;
  offender = signal(this.data.extras!.offender);
  witness = signal(this.data.extras!.witness);
  isOffender = signal(!!this.offender());
  isWitness = signal(!!this.witness());
  category = computed(() =>
    this.isOffender()
      ? InvestigationCategory.INVESTIGATION_RECORD
      : InvestigationCategory.HEARING_TRANSCRIPT,
  );
  summonedType = computed(() =>
    this.isOffender() ? SummonType.OFFENDER : SummonType.WITNESS,
  );
  personId = computed(() => {
    return this.isOffender()
      ? this.offender()!.offenderRefId
      : this.witness()!.witnessRefId;
  });

  config = inject(ConfigService);
  title = computed(() => {
    return this.isOffender()
      ? this.lang.map.investigation_report
      : this.lang.map.hearing_minutes_subject;
  });
  personControl = new FormControl({ disabled: true, value: '' });
  investigatorCtrl = new FormControl({ disabled: true, value: '' });

  locationCtrl = new FormControl();

  creationDate = new FormControl({
    disabled: true,
    value: this.datePipe.transform(Date.now(), this.config.CONFIG.DATE_FORMAT),
  });
  currentLanguage = signal(this.lang.getCurrent());
  saveQuestion$: Subject<void> = new Subject<void>();

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
    question: ['', [CustomValidators.required]],
    answer: ['', [CustomValidators.required]],
  });

  questionsList: Signal<ElementRef<HTMLUListElement> | undefined> = viewChild(
    'questionsList',
    {
      read: ElementRef,
    },
  );

  deleteQuestion$: Subject<Question> = new Subject();

  savePDF$ = new Subject<void>();

  protected override _init() {
    super._init();
    this.lang.change$.subscribe(current => {
      this.currentLanguage.set(current);
    });
  }

  override _buildForm(): void {
    this.inViewMode()
      ? this.locationCtrl.disable()
      : this.locationCtrl.enable();
    this.locationCtrl.patchValue(this.model.location!);
    this.listenToSaveQuestion();
    this.listenToDeleteQuestion();
    this.listenToSavePDF();
    this.form = this.fb.group({}); // just to not throw error while opening the popup on view mode
  }

  protected override _beforeSave(): boolean | Observable<boolean> {
    if (!this.model.detailsList.length) {
      this.dialog.error(
        this.lang.map.need_questions_and_answers_to_take_this_action,
      );
    }
    return !!this.model.detailsList.length;
  }

  protected override _prepareModel():
    | InvestigationReport
    | Observable<InvestigationReport> {
    return new InvestigationReport().clone<InvestigationReport>({
      ...this.model,
      category: this.category(),
      caseId: this.data.extras?.caseId,
      summonedType: this.summonedType(),
      summonedId: this.personId(),
      location: this.locationCtrl.getRawValue()!,
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
        this.model.detailsList = [...this.model.detailsList, question];
        this.questionForm.reset();
        setTimeout(() => {
          const element = this.questionsList()?.nativeElement;
          element &&
            element.scrollTo({
              top: element?.scrollHeight,
              behavior: 'smooth',
            });
        }, 200);
      });
  }

  clearForm() {
    this.questionForm.reset();
  }

  protected readonly AppIcons = AppIcons;

  private listenToSavePDF() {
    this.savePDF$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.dialog.info(this.lang.map.this_feature_is_being_worked_on);
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
}
