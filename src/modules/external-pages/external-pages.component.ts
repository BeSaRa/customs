import { Component, inject, OnInit } from '@angular/core';
import { UserTypes } from '@enums/user-types';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { FormControl } from '@angular/forms';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { DialogService } from '@services/dialog.service';
import { SelectAgentPopupComponent } from '@standalone/popups/select-agent-popup/select-agent-popup.component';
import { ClearingAgent } from '@models/clearing-agent';
@Component({
  selector: 'app-external-pages',
  templateUrl: './external-pages.component.html',
  styleUrls: ['./external-pages.component.scss'],
})
export class ExternalPagesComponent implements OnInit {
  employeeService = inject(EmployeeService);
  lang = inject(LangService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  clearingAgentService = inject(ClearingAgentService);
  dialog = inject(DialogService);
  control = new FormControl();
  protected readonly UserTypes = UserTypes;

  search$: Subject<string> = new Subject<string>();

  ngOnInit() {
    this.listenToSearch();
  }
  listenToSearch() {
    this.search$
      .pipe(
        switchMap(query =>
          this.clearingAgentService.loadCriteria({
            agencyId:
              this.employeeService.getLoginData()?.clearingAgency.agencyId,
            qId: query,
          }),
        ),
      )
      .pipe(
        tap(
          list =>
            !list.length &&
            this.dialog.error(this.lang.map.no_records_to_display),
        ),
        filter(list => !!list.length),
      )
      .pipe(
        switchMap(list =>
          this.dialog
            .open(SelectAgentPopupComponent, {
              data: {
                list: list,
              },
            })
            .afterClosed()
            .pipe(filter(res => !!res)),
        ),
      )
      .subscribe(selectedAgent => {
        this.router
          .navigate([], {
            relativeTo: this.activeRoute,
            queryParams: {
              id: (selectedAgent as ClearingAgent).id,
            },
          })
          .then();
      });
  }
}
