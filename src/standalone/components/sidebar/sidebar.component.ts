import {
  Component,
  ElementRef,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { InputPrefixDirective } from '@standalone/directives/input-prefix.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { SidebarMenuComponent } from '@standalone/components/sidebar-menu/sidebar-menu.component';
import { MenuItemService } from '@services/menu-item.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LangService } from '@services/lang.service';
import { LangContract } from '@contracts/lang-contract';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    MatIconModule,
    InputPrefixDirective,
    InputSuffixDirective,
    NgOptimizedImage,
    SidebarMenuComponent,
    ReactiveFormsModule,
  ],
  animations: [
    trigger('sidebar', [
      state(
        'opened',
        style({
          marginLeft: 0,
          marginRight: 0,
        })
      ),
      state(
        'closedToLeft',
        style({
          marginLeft: '-300px',
        })
      ),
      state(
        'closedToRight',
        style({
          marginRight: '-300px',
        })
      ),
      transition('* <=> opened', animate('150ms ease-in-out')),
      transition('closedFromLeft <=> closedFromRight', animate(0)),
    ]),
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  element = inject(ElementRef);
  menuItemService = inject(MenuItemService);
  lang = inject(LangService);
  items = this.menuItemService.getMenu();
  control = new FormControl('', {
    nonNullable: true,
  });

  @HostBinding('@sidebar')
  status: 'opened' | 'closedToLeft' | 'closedToRight' = 'opened';

  moveFocus() {
    const link = document.querySelector('.menu-item-link') as HTMLAnchorElement;
    link && link.focus();
  }

  toggle(): void {
    const lang = this.lang.getCurrent();
    this.status =
      this.status === 'opened'
        ? lang.code === 'ar'
          ? 'closedToRight'
          : 'closedToLeft'
        : 'opened';
  }

  ngOnInit(): void {
    this.lang.change$.subscribe((current: LangContract) => {
      this.status =
        this.status !== 'opened'
          ? current.code == 'ar'
            ? 'closedToRight'
            : 'closedToLeft'
          : this.status;
    });
  }
}
