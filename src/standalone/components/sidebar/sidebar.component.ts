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
import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
          width: '*',
        })
      ),
      state(
        'closed',
        style({
          width: '75px',
        })
      ),
      transition('* <=> opened', [animate('150ms ease-in-out')]),
    ]),
    trigger('scaleInOut', [
      state(
        'true',
        style({
          transform: 'scale(1)',
          opacity: 1,
        })
      ),
      state(
        'false',
        style({
          transform: 'scale(0)',
          opacity: 0,
        })
      ),
      transition('true <=> false', animate('150ms ease-in-out')),
    ]),
  ],
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

  @HostBinding('@sidebar')
  status: 'opened' | 'closed' = 'opened';

  @HostBinding('class.opining')
  opining = false;
  @HostBinding('class.closing')
  closing = false;

  closed = false;

  opened = false;

  @HostBinding('class')
  hostClass: 'opened' | 'closed' = 'opened';

  @HostListener('@sidebar.start', ['$event'])
  start($event: AnimationEvent): void {
    this.closing = $event.toState === 'closed';
    this.opining = $event.toState === 'opened';
  }

  @HostListener('@sidebar.done', ['$event'])
  done($event: AnimationEvent): void {
    this.hostClass = $event.toState === 'opened' ? 'opened' : 'closed';
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
}
