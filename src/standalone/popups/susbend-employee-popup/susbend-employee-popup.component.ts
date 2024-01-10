import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';

@Component({
  selector: 'app-susbend-employee-popup',
  templateUrl: './susbend-employee-popup.component.html',
  styleUrls: ['./susbend-employee-popup.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    ButtonComponent,
    IconButtonComponent
  ],
})
export class SusbendEmployeePopupComponent implements OnInit {
  lang = inject(LangService);
  constructor() { }

  ngOnInit() {
  }

}
