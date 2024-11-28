import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { LangService } from '@services/lang.service';
import { UserCustomMenuService } from '@services/user-custom-menu-service';
import { MatDialogRef } from '@angular/material/dialog';
import { CheckGroup } from '@models/check-group';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { LookupService } from '@services/lookup.service';
import { CustomMenuService } from '@services/custom-menu.service';
import { CustomMenu } from '@models/custom-menu';
import { AppIcons } from '@constants/app-icons';
import { FilterArrayPipe } from '@standalone/pipes/filter-array.pipe';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-custom-menus',
  standalone: true,
  imports: [
    FilterArrayPipe,
    HighlightPipe,
    InputComponent,
    MatCheckbox,
    MatIcon,
    MatRipple,
    MatTooltip,
  ],
  templateUrl: './user-custom-menus.component.html',
  styleUrl: './user-custom-menus.component.scss',
})
export class UserCustomMenusComponent implements OnInit {
  ngOnInit(): void {
    this.loadUserCustomMenus();
  }
  @Output() selectedMenuIds = new EventEmitter<number[]>();
  onSelectionChange(newIds: number[]): void {
    this.selectedIds = newIds;
    this.selectedMenuIds.emit(this.selectedIds);
  }

  lang = inject(LangService);
  userCustomMenuService = inject(UserCustomMenuService);
  customMenuService = inject(CustomMenuService);
  lookupService = inject(LookupService);
  dialogRef = inject(MatDialogRef);
  @Input() internalUserId!: number;
  @Input() inViewMode: boolean = false;
  selectedIds: number[] = [];
  groups: CheckGroup<CustomMenu>[] = [];
  loadGroups() {
    this.load().subscribe(groups => {
      this.groups = groups;
    });
  }
  private load(): Observable<CheckGroup<CustomMenu>[]> {
    return combineLatest({
      customMenus: this.customMenuService.loadPrivateMenus(),
      menuTypes: of(this.lookupService.lookups.menuType),
    }).pipe(
      map(({ customMenus, menuTypes }) => {
        const customMenuInstances = customMenus.map(menu =>
          Object.assign(new CustomMenu(), menu),
        );

        return menuTypes.map(menuType => {
          const items = customMenuInstances.filter(
            menu => menu.menuType === menuType.lookupKey,
          );

          const checkGroup = new CheckGroup<CustomMenu>(
            menuType,
            items,
            this.selectedIds,
            3,
          );

          checkGroup.setSelected(this.selectedIds);

          return checkGroup;
        });
      }),
    );
  }
  private loadUserCustomMenus() {
    this.userCustomMenuService
      .loadUserCustomMenus(this.internalUserId)
      .subscribe(val => {
        const ids: number[] = [];
        val.forEach(userCustomMenu => {
          ids.push(userCustomMenu.menuItemId);
        });

        this.selectedIds = ids;

        this.loadGroups();
      });
  }

  protected readonly AppIcons = AppIcons;
  hasParents(group: CheckGroup<CustomMenu>): boolean {
    return this.parents(group).length > 0;
  }

  parents(group: CheckGroup<CustomMenu>): CustomMenu[] {
    return group.list.filter(item => !item.parentMenuItemId);
  }

  children(
    group: CheckGroup<CustomMenu>,
    parentMenu: CustomMenu,
  ): CustomMenu[] {
    return group.list.filter(item => item.parentMenuItemId === parentMenu.id);
  }

  isParentSelected(
    group: CheckGroup<CustomMenu>,
    parentMenu: CustomMenu,
  ): boolean {
    const childIds = this.children(group, parentMenu).map(child => child.id);
    return childIds.every(id => group.isSelected(id));
  }

  isParentIndeterminate(
    group: CheckGroup<CustomMenu>,
    parentMenu: CustomMenu,
  ): boolean {
    const childIds = this.children(group, parentMenu).map(child => child.id);
    const selectedChildIds = childIds.filter(id => group.isSelected(id));
    return (
      selectedChildIds.length > 0 && selectedChildIds.length < childIds.length
    );
  }
  onTypeChange(group: CheckGroup<CustomMenu>): void {
    group.toggleSelection();
    this.onSelectionChange(this.getSelectedIds());
  }

  onParentChange(group: CheckGroup<CustomMenu>, parentMenu: CustomMenu): void {
    const parentSelected = group.isSelected(parentMenu.id);
    const children = this.children(group, parentMenu);

    if (parentSelected) {
      children.forEach(child => group.addToSelection(child.id));
    } else {
      children.forEach(child => group.removeFromSelection(child.id));
    }

    this.onSelectionChange(this.getSelectedIds());
  }

  onChildChange(
    group: CheckGroup<CustomMenu>,
    parentMenu: CustomMenu,
    childMenu: CustomMenu,
  ): void {
    group.toggle(childMenu.id);

    const children = this.children(group, parentMenu);
    const allChildrenSelected = children.every(child =>
      group.isSelected(child.id),
    );
    const someChildrenSelected = children.some(child =>
      group.isSelected(child.id),
    );

    if (allChildrenSelected) {
      group.addToSelection(parentMenu.id);
    } else if (someChildrenSelected) {
    } else {
      group.removeFromSelection(parentMenu.id);
    }

    this.onSelectionChange(this.getSelectedIds());
  }

  getSelectedIds(): number[] {
    return this.groups.flatMap(group => group.getSelectedValue());
  }
}
