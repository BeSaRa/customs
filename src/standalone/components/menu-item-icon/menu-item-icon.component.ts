import { Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-item-icon',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './menu-item-icon.component.html',
  styleUrls: ['./menu-item-icon.component.scss'],
})
export class MenuItemIconComponent {
  @Input({ required: true })
  item!: MenuItemContract;
}
