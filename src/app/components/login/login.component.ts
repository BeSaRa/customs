import { Component, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { AuthService } from '@services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroupControlsNonNullable } from '@app-types/form-group-controls';
import { CredentialsContract } from '@contracts/credentials-contract';
import { Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  lang = inject(LangService);
  fb = inject(FormBuilder);
  form: FormGroupControlsNonNullable<CredentialsContract> =
    this.fb.nonNullable.group({
      lang: ['AR'],
      userName: ['cdiadmin', Validators.required],
      userPassword: ['P@ssw0rd', Validators.required],
    });

  login$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.listenToLogin();
  }

  toggleLanguage() {
    this.lang.toggleLang();
  }

  listenToLogin(): void {
    this.login$
      .pipe(switchMap(() => this.authService.login(this.form.value)))
      .subscribe((value) => {
        console.log(value.internalUser.getNames());
      });
  }
}
