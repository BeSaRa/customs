import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { LookupService } from '@services/lookup.service';
import { CustomMenu } from '@models/custom-menu';
import { Lookup } from '@models/lookup';
import { MenuUrlValueContract } from '@contracts/menu-url-value-contract';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { AsyncPipe } from '@angular/common';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { CdkCell } from '@angular/cdk/table';
import { MatTooltip } from '@angular/material/tooltip';
import { CustomMenuService } from '@services/custom-menu.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { generateHtmlList, isValidValue } from '@utils/utils';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-custom-menu-url-handler',
  standalone: true,
  imports: [
    TextareaComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    ContextMenuComponent,
    FilterColumnComponent,
    HighlightPipe,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSlideToggle,
    MatSort,
    MatSortHeader,
    MatTable,
    MatTableModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkCell,
    MatTooltip,
    ButtonComponent,
  ],
  templateUrl: './custom-menu-url-handler.component.html',
  styleUrl: './custom-menu-url-handler.component.scss',
})
export class CustomMenuUrlHandlerComponent implements OnInit, AfterViewInit {
  @Input() record!: CustomMenu;
  @Input() readonly: boolean = false;

  dropListIdInitials: string = 'dropList_' + new Date().valueOf() + '_';
  lang = inject(LangService);
  fb = inject(FormBuilder);
  lookupService = inject(LookupService);
  customMenuService = inject(CustomMenuService);
  dialog = inject(DialogService);

  ngOnInit(): void {
    this._buildForm();
  }

  form!: FormGroup;
  variableList: MenuUrlValueContract[] = [];
  menuParamsList: Lookup[] = this.lookupService.lookups.menuItemParameters;
  displayedColumns: string[] = ['variable', 'variableValue'];

  private initUrlHandler(): void {
    this.variableList = this.record.urlParamsParsed;
    this.checkUrlVariables();
  }

  checkUrlVariables(userInteraction: boolean = false): void {
    const newVariableList: string[] = this.customMenuService.findVariablesInUrl(
      this.menuUrlControl.value,
    );
    if (userInteraction && !newVariableList.length) {
      this.dialog.warning(this.lang.map.no_variable_found);
      this.variableList = [];
      return;
    }
    const duplicateVariablesList = this._getDuplicateVariables(newVariableList);
    if (duplicateVariablesList.length) {
      const listHtml = generateHtmlList(
        this.lang.map.duplicate_url_variables,
        duplicateVariablesList,
      );
      this.dialog.error(listHtml.outerHTML);
      console.log('Duplicate VariablesL: ', duplicateVariablesList);
      return;
    }

    const existingVariableList = [...this.variableList];
    this.variableList = newVariableList.map((newVariable: string) => {
      const exisingVariable = existingVariableList.find(
        x => x.name.trim().toLowerCase() === newVariable.trim().toLowerCase(),
      );
      return <MenuUrlValueContract>{
        name: newVariable,
        value: exisingVariable ? exisingVariable.value : undefined,
        valueLookups: exisingVariable ? exisingVariable.valueLookups : [],
      };
    });
  }

  private _getDuplicateVariables(variableList: string[]): string[] {
    return variableList
      .map(x => x.toLowerCase())
      .filter((item: string, index: number, list: string[]) => {
        return list.indexOf(item) < index;
      });
  }

  private _buildForm() {
    this.form = this.fb.group(this.record.buildMenuUrlForm(true));
  }

  ngAfterViewInit(): void {
    this.readonly
      ? this.menuUrlControl.disable()
      : this.menuUrlControl.enable();

    this.initUrlHandler();
  }

  isValidUrl(): boolean {
    const url = this.menuUrlControl.value;
    if (this.record.isParentMenu()) {
      // if no url, its valid
      if (!isValidValue(url)) {
        return true;
      }
    } else {
      // children must have url
      if (!isValidValue(url)) {
        return false;
      }
    }
    // menu should have valid url and valid variables too
    const variables = this.customMenuService.findVariablesInUrl(url);
    return (
      this.menuUrlControl.valid &&
      (!variables.length || this.isValidVariableList)
    );
  }

  get isValidVariableList(): boolean {
    return this.variableList.every(item => item.valueLookups.length > 0);
  }

  get menuUrlControl(): UntypedFormControl {
    return this.form.get('menuURL') as UntypedFormControl;
  }

  drop(event: CdkDragDrop<Lookup[]>, row: MenuUrlValueContract): void {
    if (event.previousContainer !== event.container) {
      row.valueLookups = [];

      const item = event.previousContainer.data[event.previousIndex];
      row.valueLookups.push(item);
    }
  }

  private _addDummyItemToSourceList(index: number, item: Lookup) {
    this.menuParamsList.splice(index + 1, 0, item);
  }

  private _filterSourceList() {
    this.menuParamsList = this.menuParamsList.filter(
      (item: Lookup) => !item.temp,
    );
  }

  removeVariableValue(item: MenuUrlValueContract): void {
    if (!item.valueLookups || item.valueLookups.length === 0) {
      return;
    }
    item.value = undefined;
    item.valueLookups = [];
  }

  getConnectedListIds(): string[] {
    return this.variableList.map((_, index) => `dropList-${index}`);
  }

  protected readonly Lookup = Lookup;
}
