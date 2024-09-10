import { Component, inject, Input, OnInit } from '@angular/core';

import { MenuItemService } from '@services/menu-item.service';
import { MatIconModule } from '@angular/material/icon';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { MenuItemIconComponent } from '@standalone/components/menu-item-icon/menu-item-icon.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { LangService } from '@services/lang.service';
import { listAnimation } from '@animations/list-animation';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FilterSidebarMenuItemPipe } from '@standalone/pipes/filter-sidebar-menu-item.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { debounceTime, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-menu-item-list',
  standalone: true,
  imports: [
    MatIconModule,
    MenuItemIconComponent,
    InputComponent,
    ReactiveFormsModule,
    FilterSidebarMenuItemPipe,
    AsyncPipe,
  ],
  templateUrl: './menu-item-list.component.html',
  styleUrls: ['./menu-item-list.component.scss'],
  animations: [
    listAnimation,
    trigger('addRemoveItem', [
      transition(':leave', [
        animate(
          '200ms',
          style({
            transform: 'scale(0)',
            opacity: 0,
          }),
        ),
      ]),
      transition(':enter', [
        style({
          transform: 'scale(0)',
          opacity: 0,
        }),
        animate(
          '200ms',
          style({
            transform: 'scale(1)',
            opacity: 1,
          }),
        ),
      ]),
    ]),
  ],
})
export class MenuItemListComponent implements OnInit {
  menuItemService = inject(MenuItemService);
  lang = inject(LangService);
  @Input()
  parent?: number;
  @Input()
  items: MenuItemContract[] = [];

  control = new FormControl('', { nonNullable: true });
  value: Observable<string> = this.control.valueChanges.pipe(debounceTime(200));

  ngOnInit(): void {
    if (this.items) return;

    this.items = this.parent
      ? this.menuItemService.getChildren(this.parent)
      : this.menuItemService.getMenu();
  }
}
