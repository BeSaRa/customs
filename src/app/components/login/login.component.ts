import { Component } from '@angular/core';
import { LangService } from '@services/lang.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  ctrl: FormControl<string | null> = new FormControl<string | null>('151515', {
    validators: Validators.required,
  });

  ctrl2 = new FormControl('', {
    validators: Validators.required,
  });
  model = '707070';
  group = new FormGroup({
    myControl: new FormControl('505050', {
      validators: Validators.required,
    }),
  });
  constructor(public lang: LangService) {
    this.ctrl.valueChanges.subscribe();
  }

  toggleLanguage() {
    this.lang.toggleLang();
  }

  log($e: Event): void {
    console.log($e);
    // console.log($event, size);
  }
}
