import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MenuItemService } from '@services/menu-item.service';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatIcon } from '@angular/material/icon';
import { LangService } from '@services/lang.service';
import { startWith, takeUntil } from 'rxjs';
import { LangCodes } from '@enums/lang-codes';
import { RouterLink } from '@angular/router';
import { CustomMenuService } from '@services/custom-menu.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dynamic-menu-details',
  standalone: true,
  imports: [IconButtonComponent, MatIcon, RouterLink],
  templateUrl: './dynamic-menu-details.component.html',
  styleUrl: './dynamic-menu-details.component.scss',
})
export class DynamicMenuDetailsComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  private lang = inject(LangService);
  private menuItemService = inject(MenuItemService);
  // { customMenuService } need to be injected here of will throw an error while preparing  the url
  private customMenuService = inject(CustomMenuService);
  private domSanitizer = inject(DomSanitizer);
  items: MenuItemContract[] = [];
  parentId = input<string>();
  childId = input<string>();
  url: null | SafeUrl = null;
  breadcrumbs: MenuItemContract[] = [];
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.h-full')
  @HostBinding('class.w-full')
  class = true;

  parentEffect = effect(() => {
    this.breadcrumbs = [];
    if (this.parentId()) {
      this.breadcrumbs = this.breadcrumbs.concat(
        this.menuItemService.parents.find(item => item.id === this.parentId())!,
      );
    }

    if (this.childId()) {
      this.breadcrumbs = this.breadcrumbs.concat(
        this.menuItemService
          .getChildren(this.parentId()!)
          .find(item => item.id === this.childId())!,
      );
    }

    this.prepareUrl();
  });

  icon: string = 'chevron-double-left';

  ngOnInit(): void {
    this.lang.change$
      .pipe(takeUntil(this.destroy$))
      .pipe(startWith(this.lang.getCurrent()))
      .subscribe(lang => {
        this.icon =
          lang.code === LangCodes.AR
            ? 'chevron-double-left'
            : 'chevron-double-right';

        this.prepareUrl();
      });
  }

  prepareUrl() {
    if (!this.breadcrumbs.length) return;

    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.breadcrumbs.slice(-1)[0].customMenu!.parseUrl(),
    );
  }
}
