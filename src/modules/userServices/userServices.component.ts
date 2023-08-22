import { Component } from '@angular/core';
import { MenuIdes } from '@constants/menu-ides';

@Component({
  selector: 'app-user-services',
  templateUrl: './userServices.component.html',
  styleUrls: ['./userServices.component.scss'],
})
export class UserServicesComponent {
  protected readonly MenuIdes = MenuIdes;
}
