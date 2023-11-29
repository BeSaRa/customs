import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';

@Component({
  selector: 'app-offender-decission-form',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, ButtonComponent, IconButtonComponent, TextareaComponent ],
  templateUrl: './offender-decission-form.component.html',
  styleUrls: ['./offender-decission-form.component.scss']
})
export class OffenderDecissionFormComponent implements OnInit {
  @Input({ required: true }) form!: UntypedFormGroup;

  constructor() { }

  ngOnInit() {
  }

}
