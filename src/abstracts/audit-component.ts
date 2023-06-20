import { Directive, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { map, Observable, ReplaySubject } from 'rxjs';

import { AppTableDataSource } from '@models/app-table-data-source';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { AuditComponentContract } from '@contracts/audit-component-contract';
import { Audit } from '@models/audit';
import { SortOptionsContract } from '@contracts/sort-options-contract';

@Directive({})
export abstract class AuditComponent<S, PrimaryType = number> extends OnDestroyMixin(class {}) implements AuditComponentContract<S> {
  abstract service: S;
  lang = inject(LangService);
  reload$ = new ReplaySubject<void>(1);
  sort$: ReplaySubject<SortOptionsContract | undefined> = new ReplaySubject<SortOptionsContract | undefined>(1);
  abstract columnsWrapper: ColumnsWrapper<Audit>;
}
