import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { LangService } from '@services/lang.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { ContextMenuItemComponent } from '@standalone/components/context-menu-item/context-menu-item.component';
import { take } from 'rxjs';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, ContextMenuItemComponent, MatListModule],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  lang = inject(LangService);

  @Input({ required: true })
  set actions(actions: ContextMenuActionContract<never>[]) {
    this._actions = actions;
    this.buildHierarchy();
  }

  get actions(): ContextMenuActionContract<never>[] {
    return this._actions;
  }

  _actions: ContextMenuActionContract<never>[] = [];

  filteredActions: ContextMenuActionContract<never>[] = [];
  private children: Record<string, ContextMenuActionContract<never>[]> = {} as Record<string, ContextMenuActionContract<never>[]>;
  private parents: ContextMenuActionContract<never>[] = [];

  @ViewChild(MatMenuTrigger)
  private trigger!: MatMenuTrigger;
  top = 0;
  left = 0;
  item?: unknown;

  open($event: MouseEvent, item: unknown): void {
    $event?.preventDefault();
    this.top = $event.clientY;
    this.left = $event.clientX;
    const target = $event.target as unknown as HTMLElement;

    const name = target.localName;

    const parent = target.parentElement;
    const isTR = () => parent?.nodeName === 'TR';

    this.trigger.menuOpened.pipe(take(1)).subscribe(() => {
      parent && isTR() ? parent.classList.add('highlight') : null;
    });

    this.trigger.menuClosed.pipe(take(1)).subscribe(() => {
      parent && isTR() ? parent.classList.remove('highlight') : null;
    });

    !['input', 'button'].includes(name) &&
      (() => {
        this.trigger.openMenu();
        const { _overlayRef: overlayRef } = this.trigger as unknown as {
          _overlayRef: OverlayRef;
        };
        Promise.resolve().then(() => overlayRef.setDirection(this.lang.getCurrent().direction));
        this.item = item;
      })();
  }

  private buildHierarchy(): void {
    this.children = {} as Record<string, ContextMenuActionContract<never>[]>;
    this._actions.forEach(item => {
      if (!item.parent) {
        this.parents.push(item);
      } else {
        if (item.parent === item.name) {
          throw Error(`please check your actions there is item has same name/parent value called '${item.name}'`);
        }
        if (!Object.prototype.hasOwnProperty.call(this.children, item.parent)) {
          this.children[item.parent] = [];
        }
        this.children[item.parent].push(item);
      }
    });
    this.parents.forEach(item => {
      item.children = this.getChildrenItems(item);
    });
    this.filteredActions = this.parents.slice();
  }

  private getChildrenItems(item: ContextMenuActionContract<never>): ContextMenuActionContract<never>[] {
    const children: ContextMenuActionContract<never>[] = this.children[item.name];
    (children ?? []).forEach(item => {
      item.children = this.getChildrenItems(item);
    });
    return children;
  }

  hasChildren(action: ContextMenuActionContract<never>): boolean {
    return !!(action.children && action.children.length);
  }

  getActionLabel(action: ContextMenuActionContract<never>): string {
    if (!this.item) return '';

    return typeof action.label === 'function' ? action.label(this.item as never) : this.lang.map[action.label as keyof LangKeysContract];
  }

  callback(action: ContextMenuActionContract<never>) {
    typeof action.callback === 'function' && !this.isDisabled(action) && action.callback(this.item as never);
  }

  isDisabled(action: ContextMenuActionContract<never>): boolean {
    return typeof action.disabled !== 'undefined'
      ? typeof action.disabled === 'function'
        ? action.disabled(this.item as never)
        : action.disabled
      : false;
  }
}
