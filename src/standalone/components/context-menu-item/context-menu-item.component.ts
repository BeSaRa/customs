import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LangService } from '@services/lang.service';
import { LangKeysContract } from '@contracts/lang-keys-contract';

@Component({
  selector: 'app-context-menu-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  templateUrl: './context-menu-item.component.html',
  styleUrls: ['./context-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuItemComponent {
  @Input()
  level!: number;
  private lang = inject(LangService);

  @Input()
  actions: ContextMenuActionContract<never>[] = [];
  @Input()
  item: unknown;

  @ViewChild('menu')
  public childMenu!: MatMenu;
  @ViewChild(MatMenuTrigger)
  private trigger?: MatMenuTrigger;

  hasChildren(action: ContextMenuActionContract<never>): boolean {
    return !!(action && action.children && action.children.length);
  }

  getActionLabel(action: ContextMenuActionContract<never>): string {
    return typeof action.label === 'function'
      ? action.label(this.item as never)
      : this.lang.map[action.label as keyof LangKeysContract] ||
          `messing key ${action.label}`;
  }
}
