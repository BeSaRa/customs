import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { InvestigationReportService } from '@services/investigation-report.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { InvestigationReport } from '@models/investigation-report';
import { LangService } from '@services/lang.service';
import { MatTooltip } from '@angular/material/tooltip';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { of, Subject } from 'rxjs';
import { exhaustMap, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { SummonType } from '@enums/summon-type';
import { DatePipe, JsonPipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ignoreErrors } from '@utils/utils';
import { ConfigService } from '@services/config.service';
import { ToastService } from '@services/toast.service';
import { Witness } from '@models/witness';
import { InvestigationCategory } from '@enums/investigation-category';
import { ReportStatus } from '@enums/report-status';
import { InvestigationService } from '@services/investigation.service';
import { EmployeeService } from '@services/employee.service';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-investigation-records-table',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatTooltip,
    DatePipe,
    JsonPipe,
    IconButtonComponent,
    MatCheckbox,
  ],
  templateUrl: './investigation-records-table.component.html',
  styleUrl: './investigation-records-table.component.scss',
})
export class InvestigationRecordsTableComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  investigationReportService = inject(InvestigationReportService);
  investigationService = inject(InvestigationService);
  models: InvestigationReport[] = [];
  person = input.required<Offender | Witness>();
  model = input.required<Investigation>();
  selected = input<Offender | Witness>();

  isOffender = computed(() => {
    return this.person() instanceof Offender;
  });
  isWitness = computed(() => {
    return this.person() instanceof Witness;
  });
  reload$ = new Subject<void>();
  selectedChange = effect(() => {
    if (this.selected() === this.person()) {
      this.reload$.next();
    }
  });

  displayedColumns = ['date', 'creator', 'status', 'actions'];
  view$ = new Subject<InvestigationReport>();
  edit$ = new Subject<InvestigationReport>();
  download$ = new Subject<InvestigationReport>();
  isOpenedFromSearch = input<boolean>(false);
  upload$ = new Subject<File>();
  config = inject(ConfigService);
  toast = inject(ToastService);
  selectedUploadReport?: InvestigationReport;
  uploader?: HTMLInputElement;
  reloadInput = input.required<
    Subject<{
      type: 'call' | 'investigation';
      offenderId?: number;
      witnessId?: number;
    }>
  >();

  category = computed(() => {
    return this.model().inLegalAffairsActivity() ||
      (this.isOpenedFromSearch() &&
        this.employeeService.isOneOfLegalAffairsTeams())
      ? this.isOffender()
        ? InvestigationCategory.LEGAL_AFFAIRS_INVESTIGATION_RECORD
        : InvestigationCategory.LEGAL_AFFAIRS_HEARING_TRANSCRIPT
      : this.isOffender()
        ? InvestigationCategory.DISCIPLINARY_COMMITTEE_INVESTIGATION_RECORD
        : InvestigationCategory.DISCIPLINARY_COMMITTEE_HEARING_TRANSCRIPT;
  });
  changeIsExportableStatus$: Subject<InvestigationReport> =
    new Subject<InvestigationReport>();
  protected employeeService = inject(EmployeeService);

  assertType(item: unknown): InvestigationReport {
    return item as InvestigationReport;
  }

  ngOnInit(): void {
    this.listenToReload();
    this.listenToView();
    this.listenToEdit();
    this.listenToDownload();
    this.listenToUpload();
    this.listenToChangeIsExportableStatus();
    this.listenToReloadInput();
  }

  listenToChangeIsExportableStatus() {
    this.changeIsExportableStatus$
      .pipe(filter(element => !!element.documentVsId))
      .pipe(
        switchMap(element => {
          return this.investigationService.updateIsExportable(
            element.documentVsId as string,
            !element.isExportable,
            true,
          );
        }),
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter(() =>
          this.employeeService.hasPermissionTo(
            'ADMINISTRATIVE_INVESTIGATION_REPORT',
          ),
        ),
      )
      .pipe(
        switchMap(() => {
          return this.investigationReportService
            .load(undefined, {
              caseId: this.model().id,
              category: this.category(),
              summonedType: this.isOffender()
                ? SummonType.OFFENDER
                : SummonType.WITNESS,
              summonedId: this.person().id,
            })
            .pipe(ignoreErrors());
        }),
      )
      .subscribe(result => {
        this.models = result.rs;
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(report => {
          switch (report.status) {
            case ReportStatus.APPROVED:
              return this.investigationService.getDecisionFileAttachments(
                report.documentVsId!,
              );
            default:
              return report
                .openView({
                  ...(this.isOffender()
                    ? { offender: this.person() }
                    : { witness: this.person() }),
                  model: this.model(),
                })
                .afterClosed();
          }
        }),
      )
      .subscribe();
  }

  private listenToEdit() {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(report => {
          return report
            .openEdit({
              ...(this.isOffender()
                ? { offender: this.person() }
                : { witness: this.person() }),
              model: this.model(),
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }

  private listenToDownload() {
    this.download$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model =>
          model
            .download()
            .pipe(ignoreErrors())
            .pipe(
              map(blob => {
                return {
                  blob,
                  model,
                };
              }),
            ),
        ),
      )
      .pipe(
        switchMap(({ model }) => {
          return model.documentVsId
            ? of(model)
            : this.investigationReportService.loadById(model.id);
        }),
      )
      .subscribe(model => {
        this.replaceReport(model);
      });
  }

  private replaceReport(model: InvestigationReport) {
    this.models.splice(
      this.models.findIndex(item => item.id === model.id),
      1,
      model,
    );
    this.models = this.models.slice();
  }

  private listenToUpload() {
    this.upload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter(() => !!this.selectedUploadReport),
        switchMap(file => {
          return this.selectedUploadReport!.upload(file);
        }),
        switchMap(() => {
          return this.investigationReportService.loadById(
            this.selectedUploadReport!.id,
          );
        }),
      )
      .subscribe(model => {
        this.toast.success(this.lang.map.file_uploaded_successfully);
        this.uploader!.value = '';
        this.replaceReport(model);
        this.selectedUploadReport = undefined;
        this.reload$.next();
      });
  }

  getFile($event: Event) {
    const files = ($event.target as HTMLInputElement).files;
    files && files.length && this.upload$.next(files[0]);
  }

  clickOnUploadButton(uploader: HTMLInputElement, report: InvestigationReport) {
    uploader.click();
    this.selectedUploadReport = report;
    this.uploader = uploader;
  }

  private listenToReloadInput() {
    this.reloadInput() &&
      this.reloadInput()
        .pipe(takeUntil(this.destroy$))
        .pipe(
          filter(value =>
            value.type === 'investigation' && this.isOffender()
              ? value.offenderId === this.person().id
              : value.witnessId === this.person().id,
          ),
        )
        .subscribe(() => this.reload$.next());
  }
}
