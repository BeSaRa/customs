import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { AuthService } from '@services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AppRoutes } from '@constants/app-routes';
import { CommonService } from '@services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  lang = inject(LangService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  router = inject(Router);
  commonService = inject(CommonService);

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

  form: FormGroup<{
    lang: FormControl<string>;
    userName: FormControl<string>;
    userPassword: FormControl<string>;
  }> = this.fb.nonNullable.group({
    lang: ['AR'],
    userName: ['', Validators.required],
    userPassword: ['', Validators.required],
  });

  login$: Subject<void> = new Subject<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'F1') {
      event.preventDefault();
      this.router.navigate(['/' + AppRoutes.EXTERNAL_LOGIN]).then();
    }
  }

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
          this.authService.login(this.form.value).pipe(ignoreErrors()),
        ),
      )
      .pipe(
        switchMap(() => {
          return this.commonService.loadCounters();
        }),
      )
      .subscribe(() => {
        this.toast.success('logged in successfully!');
        this.router.navigate([AppFullRoutes.LANDING_PAGE]).then();
      });
  }

  toggleEye() {
    this.selectedPasswordOptions =
      this.eyeIcons[this.selectedPasswordOptions.icon];
  }
}
