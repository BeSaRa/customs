import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { PenaltyDetails } from '@models/penalty-details';
import { PenaltyDetailsService } from '@services/penalty-details.service';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { filter } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { UserClick } from '@enums/user-click';
import { LegalRuleService } from '@services/legal-rule.service';
import { LegalRule } from '@models/legal-rule';

@Component({
  selector: 'app-penalty-details',
  templateUrl: './penalty-details.component.html',
})
export class PenaltyDetailsComponent implements OnInit {
  dialog = inject(DialogService);
  service = inject(PenaltyDetailsService);
  lang = inject(LangService);
  legalRuleService = inject(LegalRuleService);
  legalRules!: LegalRule[];
  @Input() list!: PenaltyDetails[];
  @Output() listChange = new EventEmitter<PenaltyDetails[]>();

  @Output() listIsEmpty = new EventEmitter<boolean>();
  @Input() viewMode!: boolean;
  @Input() isEmployee!: boolean;
  displayedList: MatTableDataSource<PenaltyDetails> =
    new MatTableDataSource<PenaltyDetails>(this.list);
  displayedColumns = [
    'penaltySigner',
    'offenderLevel',
    'legalRule',
    'legalTextArabic',
    'actions',
  ];

  ngOnInit(): void {
    this.legalRuleService.loadAsLookups().subscribe((data) => {
      this.legalRules = data;
      this.setDisplayedList();
    });
  }
  setDisplayedList() {
    this.list = this.list.map((listItem) => {
      const legalTextArabic = this.legalRules.find(
        (item) => item.id === listItem.legalRule,
      )?.legalTextArabic;
      listItem.legalTextArabic = legalTextArabic || '';
      return listItem;
    });
    this.displayedList = new MatTableDataSource<PenaltyDetails>(this.list);
  }

  actions: ContextMenuActionContract<PenaltyDetails>[] = this.viewMode
    ? [
        {
          name: 'view',
          type: 'action',
          label: 'view',
          icon: AppIcons.VIEW,
          callback: (item) => {
            this.viewDetails(item);
          },
        },
        {
          name: 'edit',
          type: 'action',
          label: 'edit',
          callback: (item) => {
            this.editDetails(item);
          },
          icon: AppIcons.EDIT,
        },
        {
          name: 'delete',
          type: 'action',
          label: 'delete',
          icon: AppIcons.DELETE,
          callback: (item) => {
            this.deleteDetails(item);
          },
        },
      ]
    : [
        {
          name: 'view',
          type: 'action',
          label: 'view',
          icon: AppIcons.VIEW,
          callback: (item) => {
            this.viewDetails(item);
          },
        },
      ];

  viewDetails(penaltyDetails: PenaltyDetails) {
    this.service.openViewDialog(penaltyDetails).afterClosed().subscribe();
  }

  createDetails() {
    this.service
      .openCreateDialog(undefined, { isEmployee: this.isEmployee })
      .afterClosed()
      .pipe(
        filter((model): model is PenaltyDetails => {
          return this.service.isInstanceOf(model);
        }),
      )
      .subscribe((result) => {
        // if (!result) return;
        this.list = this.list.concat(result);
        this.reloadDataSource();
      });
  }

  editDetails(penaltyDetails: PenaltyDetails) {
    this.service
      .openEditDialog(penaltyDetails, { isEmployee: this.isEmployee })
      .afterClosed()
      .pipe(
        filter((model): model is PenaltyDetails => {
          return this.service.isInstanceOf(model);
        }),
      )
      .subscribe((result) => {
        const index = this.list.indexOf(penaltyDetails);
        this.list[index] = result;
        this.reloadDataSource();
      });
  }

  deleteDetails(penaltyDetails: PenaltyDetails) {
    this.dialog
      .confirm(
        this.lang.map.msg_delete_x_confirm.change({
          x: this.lang.map.menu_penalty_details,
        }),
      )
      .afterClosed()
      .pipe(
        filter((value) => {
          return value === UserClick.YES;
        }),
      )
      .subscribe(() => {
        const index = this.list.indexOf(penaltyDetails);
        this.list.splice(index, 1);
        this.reloadDataSource();
      });
  }

  protected reloadDataSource() {
    this.listChange.emit(this.list);
    this.displayedList = new MatTableDataSource(this.list);
    this.listIsEmpty.emit(!this.list.length);
  }
}
