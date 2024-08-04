import { Component, Input, OnInit } from '@angular/core';
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
import { DialogService } from '@services/dialog.service';
import { CustomMenuService } from '@services/custom-menu.service';
import { CustomMenu } from '@models/custom-menu';
import { Lookup } from '@models/lookup';
import { MenuUrlValueContract } from '@contracts/menu-url-value-contract';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDropList,
  copyArrayItem,
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
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader } from '@angular/material/sort';

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
  ],
  templateUrl: './custom-menu-url-handler.component.html',
  styleUrl: './custom-menu-url-handler.component.scss',
})
export class CustomMenuUrlHandlerComponent implements OnInit {
  @Input() record!: CustomMenu;
  @Input() readonly: boolean = false;

  dropListIdInitials: string = 'dropList_' + new Date().valueOf() + '_';
  lang = inject(LangService);
  fb = inject(FormBuilder);
  lookupService = inject(LookupService);
  dialogService = inject(DialogService);
  customMenuService = inject(CustomMenuService);

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

  private _buildForm(): any {
    this.form = this.fb.group(this.record.buildMenuUrlForm(true));
    // this.readonly
    //   ? this.menuUrlControl.disable()
    //   : this.menuUrlControl.enable();

    this.initUrlHandler();
  }

  // isValidUrl(): boolean {
  //   const url = this.menuUrlControl.value;
  //   if (this.record.isParentMenu()) {
  //     // if no url, its valid
  //     if (!CommonUtils.isValidValue(url)) {
  //       return true;
  //     }
  //   } else {
  //     // children must have url
  //     if (!CommonUtils.isValidValue(url)) {
  //       return false;
  //     }
  //   }
  //   // menu should have valid url and valid variables too
  //   const variables = this.customMenuService.findVariablesInUrl(url);
  //   return (
  //     this.menuUrlControl.valid &&
  //     (!variables.length || this.isValidVariableList)
  //   );
  // }

  isTouchedOrDirty(): boolean {
    return this.form && (this.form.touched || this.form.dirty);
  }

  get isValidVariableList(): boolean {
    return this.variableList.every(item => item.valueLookups.length > 0);
  }

  get menuUrlControl(): UntypedFormControl {
    return this.form.get('menuURL') as UntypedFormControl;
  }

  private _getDuplicateVariables(variableList: string[]): string[] {
    return variableList
      .map(x => x.toLowerCase())
      .filter((item: string, index: number, list: string[]) => {
        return list.indexOf(item) < index;
      });
  }

  checkUrlVariables(userInteraction: boolean = false): void {
    // const newVariableList: string[] = this.customMenuService.findVariablesInUrl(
    //   this.menuUrlControl.value,
    // );
    // if (userInteraction && !newVariableList.length) {
    //   this.toast.info(this.lang.map.msg_no_variables_found);
    //   return;
    // }
    // const duplicateVariablesList = this._getDuplicateVariables(newVariableList);
    // if (duplicateVariablesList.length) {
    //   const listHtml = CommonUtils.generateHtmlList(
    //     this.lang.map.msg_duplicate_url_variables,
    //     duplicateVariablesList,
    //   );
    //   this.dialogService.error(listHtml.outerHTML);
    //   return;
    // }
    //
    // const existingVariableList = [...this.variableList];
    // this.variableList = newVariableList.map((newVariable: string) => {
    //   const exisingVariable = existingVariableList.find(
    //     x => x.name.trim().toLowerCase() === newVariable.trim().toLowerCase(),
    //   );
    //   return <MenuUrlValueContract>{
    //     name: newVariable,
    //     value: exisingVariable ? exisingVariable.value : undefined,
    //     valueLookups: exisingVariable ? exisingVariable.valueLookups : [],
    //   };
    // });
  }

  getConnectedListIds(): string[] {
    return this.variableList.map(
      (item, index) => this.dropListIdInitials + index,
    );
  }

  canDropValue(item: CdkDrag<Lookup>, dropList: CdkDropList): boolean {
    return !dropList.data.length;
  }

  onExitSourceList(event: CdkDragExit) {
    const currentIdx = event.container.data.findIndex(
      (item: Lookup) => item.lookupKey === event.item.data.lookupKey,
    );

    const replacementValue = new Lookup().clone({
      ...event.item.data,
      temp: true,
    });
    this._addDummyItemToSourceList(
      currentIdx,
      replacementValue as unknown as Lookup,
    );
  }

  onEnterSourceList(event: CdkDragEnter) {
    this._filterSourceList();
  }

  drop(event: CdkDragDrop<Lookup[]>) {
    if (event.previousContainer !== event.container) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    if (event.previousContainer.data) {
      this._filterSourceList();
    }
  }

  private _addDummyItemToSourceList(index: number, item: Lookup) {
    this.menuParamsList.splice(index + 1, 0, item);
  }

  private _filterSourceList() {
    // this.menuParamsList = this.menuParamsList.filter(
    //   (item: Lookup) => !item.temp,
    // );
  }

  removeVariableValue(item: MenuUrlValueContract): void {
    if (!item.valueLookups || item.valueLookups.length === 0) {
      return;
    }
    // this.dialogService
    //   .confirm(
    //     this.lang.map.msg_confirm_delete_x.change({
    //       x: item.valueLookups[0].getName(),
    //     }),
    //   )
    //   .onAfterClose$.subscribe((clickOn: UserClickOn) => {
    //     if (clickOn === UserClickOn.YES) {
    //       item.value = undefined;
    //       item.valueLookups = [];
    //     }
    //   });
  }
}
