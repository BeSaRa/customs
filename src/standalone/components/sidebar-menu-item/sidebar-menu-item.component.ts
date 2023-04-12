import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { SidebarMenuAnimation } from '../../../animsations/sidebar-menu-animation';
import { FilterSidebarMenuItemPipe } from '@standalone/pipes/filter-sidebar-menu-item.pipe';
import { LangService } from '@services/lang.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    FilterSidebarMenuItemPipe,
  ],
  templateUrl: './sidebar-menu-item.component.html',
  styleUrls: ['./sidebar-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [SidebarMenuAnimation],
})
export class SidebarMenuItemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  private _searchText = '';
  @Input()
  level!: number;
  @Input()
  item!: MenuItemContract;
  @Input()
  menuStatus: 'opened' | 'closed' = 'closed';
  cd = inject(ChangeDetectorRef);
  lang = inject(LangService);

  @Input()
  set searchText(value) {
    this._searchText = value || '';
    value ? (this.menuStatus = 'opened') : (this.menuStatus = 'closed');
  }

  get searchText(): string {
    return this._searchText;
  }

  get hasChildren(): boolean {
    return !!(this.item.children && this.item.children.length);
  }

  trackByLangKey(index: number, item: MenuItemContract) {
    return item.langKey;
  }

  toggleMenu(): void {
    this.menuStatus = this.menuStatus === 'opened' ? 'closed' : 'opened';
  }

  ngOnInit(): void {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cd.markForCheck();
    });
  }
}
