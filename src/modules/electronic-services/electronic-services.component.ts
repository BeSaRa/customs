import { Component } from '@angular/core';
import { MenuIdes } from '@constants/menu-ides';

@Component({
  selector: 'app-electronic-services',
  templateUrl: './electronic-services.component.html',
  styleUrls: ['./electronic-services.component.scss'],
})
export class ElectronicServicesComponent {
  protected readonly MenuIdes = MenuIdes;
}
