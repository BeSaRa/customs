import { Component } from '@angular/core';
import { MenuIdes } from '@constants/menu-ides';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent {
  protected readonly MenuIdes = MenuIdes;
}
