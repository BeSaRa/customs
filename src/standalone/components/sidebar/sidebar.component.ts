import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { InputPrefixDirective } from '@standalone/directives/input-prefix.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { SidebarMenuComponent } from '@standalone/components/sidebar-menu/sidebar-menu.component';
import { MenuItemService } from '@services/menu-item.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AnimationEvent } from '@angular/animations';
import { SidebarAnimation } from '@animations/sidebar-animation';
import { SearchAnimation } from '@animations/search-animation';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { LangService } from '@services/lang.service';

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
    NgScrollbarModule,
  ],
  animations: [SidebarAnimation, SearchAnimation],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  element = inject(ElementRef);
  menuItemService = inject(MenuItemService);
  items = this.menuItemService.getMenu();
  control = new FormControl('', {
    nonNullable: true,
  });

  lang = inject(LangService);

  @HostBinding('class')
  @HostBinding('@sidebar')
  status: 'opened' | 'closed' = 'opened';

  @HostBinding('class.opining')
  opining = false;
  @HostBinding('class.closing')
  closing = false;

  closed = false;

  opened = false;

  @HostListener('@sidebar.start', ['$event'])
  start($event: AnimationEvent): void {
    this.closing = $event.toState === 'closed';
    this.opining = $event.toState === 'opened';
  }

  @HostListener('@sidebar.done', ['$event'])
  done($event: AnimationEvent): void {
    this.opened = $event.toState === 'opened';
    this.closed = !this.opened;
    this.closing = false;
    this.opining = false;
  }

  moveFocus() {
    const link = document.querySelector('.menu-item-link') as HTMLAnchorElement;
    link && link.focus();
  }

  toggle(): void {
    this.status = this.status === 'opened' ? 'closed' : 'opened';
  }

  isClosingOrClosed(): boolean {
    return this.closing || (this.closed && !this.opining);
  }

  get direction() {
    return this.lang.getCurrent().direction;
  }

  isOpened(): boolean {
    return this.status === 'opened';
  }

  isClosed(): boolean {
    return !this.isOpened();
  }
}
