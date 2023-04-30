import { Component, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { AuthService } from '@services/auth.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // dialog = inject(DialogService);
  authService = inject(AuthService);
  lang = inject(LangService);
  fb = inject(FormBuilder);
  //localizationService = inject(LocalizationService);
  toast = inject(ToastService);
  router = inject(Router);

  eyeIcons: Record<
    'eye' | 'eye-off',
    {
      icon: 'eye' | 'eye-off';
      inputType: 'password' | 'text';
    }
  > = {
    eye: {
      icon: 'eye-off',
      inputType: 'text',
    },
    'eye-off': {
      icon: 'eye',
      inputType: 'password',
    },
  };
  selectedPasswordOptions = this.eyeIcons['eye-off'];

  form: UntypedFormGroup = this.fb.nonNullable.group({
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
      .pipe(
        switchMap(() =>
          this.authService.login(this.form.value).pipe(ignoreErrors())
        )
      )
      .subscribe(() => {
        this.toast.success('logged in successfully!');
        this.router.navigate([AppFullRoutes.ADMINISTRATION]).then();
      });
  }

  toggleEye() {
    this.selectedPasswordOptions =
      this.eyeIcons[this.selectedPasswordOptions.icon];
  }
}
