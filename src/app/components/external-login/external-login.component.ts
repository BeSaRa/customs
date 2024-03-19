import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { AuthService } from '@services/auth.service';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, switchMap, tap } from 'rxjs';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { CustomValidators } from '@validators/custom-validators';
import { LookupService } from '@services/lookup.service';
import { UserTypes } from '@enums/user-types';
import { filter, map } from 'rxjs/operators';
import { DialogService } from '@services/dialog.service';
import { VerifyPopupComponent } from './components/verify-popup/verify-popup.component';
import { AppRoutes } from '@constants/app-routes';

@Component({
  selector: 'app-external-login',
  templateUrl: './external-login.component.html',
  styleUrls: ['./external-login.component.scss'],
})
export class ExternalLoginComponent implements OnInit {
  authService = inject(AuthService);
  lang = inject(LangService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  router = inject(Router);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  protected readonly userTypes = UserTypes;
  form: UntypedFormGroup = this.fb.nonNullable.group({
    userType: [null],
    qid: ['', [CustomValidators.required]],
    licenseNo: [''],
  });

  login$: Subject<void> = new Subject<void>();
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'F1') {
      event.preventDefault();
      this.router.navigate(['/' + AppRoutes.LOGIN]).then();
    }
  }
  ngOnInit(): void {
    this.listenToLogin();
  }

  toggleLanguage() {
    this.lang.toggleLang();
  }
  handleUseTypeChange() {
    const licenseNo = this.form.get('licenseNo');
    const qid = this.form.get('qid');
    licenseNo?.setValidators([]);
    qid?.setValidators([]);
    if (this.isClearingAgency) {
      licenseNo?.setValidators([CustomValidators.required]);
    } else {
      qid?.setValidators([CustomValidators.required]);
    }
    licenseNo?.updateValueAndValidity();
    qid?.updateValueAndValidity();
  }
  listenToLogin(): void {
    this.login$
      .pipe(
        tap(
          () =>
            this.form.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
        filter(() => this.form.valid),
        switchMap(() =>
          this.authService.externalLogin(this.form.value).pipe(ignoreErrors()),
        ),
      )
      .pipe(
        switchMap(res => {
          return this.dialog
            .open(VerifyPopupComponent)
            .afterClosed()
            .pipe(
              filter(result => !!result),
              map(otp => {
                return {
                  userType: this.form.value.userType,
                  licenseNo: this.form.value.licenseNo,
                  qid: this.form.value.qid,
                  mfaToken: res.mfaToken,
                  otp: otp as string,
                };
              }),
            );
        }),
      )
      .pipe(
        switchMap(payload => {
          return this.authService.verifyExternalLogin(payload);
        }),
      )
      .subscribe(() => {
        this.toast.success('logged in successfully!');
        this.router.navigate([AppFullRoutes.EXTERNAL_HOME]).then();
      });
  }
  get isClearingAgency() {
    return (
      this.form.get('userType')?.value === UserTypes.EXTERNAL_CLEARING_AGENCY
    );
  }
  protected readonly UserTypes = UserTypes;
}
