import { Component } from '@angular/core';
import { MenuItemListComponent } from '@standalone/components/menu-item-list/menu-item-list.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [MenuItemListComponent],
})
export default class MainComponent {}
