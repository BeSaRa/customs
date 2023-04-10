import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LangContract } from '@contracts/lang-contract';
import { delay, distinctUntilChanged, map, of, Subject, tap } from 'rxjs';
import { LangChangeProcess } from '@enums/lang-change-process';
import { LangCodes } from '@enums/lang-codes';
import { DOCUMENT } from '@angular/common';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { Localization } from '@models/localization';

@Injectable({
  providedIn: 'root',
})
export class LangService extends RegisterServiceMixin(class {}) {
  private languages: LangContract[] = [
    {
      id: 1,
      code: LangCodes.AR,
      name: 'Arabic',
      direction: 'rtl',
      toggleTo: LangCodes.EN,
    },
    {
      id: 2,
      code: LangCodes.EN,
      name: 'English',
      direction: 'ltr',
      toggleTo: LangCodes.AR,
    },
  ];
  private change = new Subject<LangContract>();
  private langChangerNotifier: Subject<LangChangeProcess> =
    new Subject<LangChangeProcess>();
  private arabic: Record<keyof LangKeysContract, string> = {} as Record<
    keyof LangKeysContract,
    string
  >;
  private english: Record<keyof LangKeysContract, string> = {} as Record<
    keyof LangKeysContract,
    string
  >;

  langChangeProcess$ = this.langChangerNotifier
    .asObservable()
    .pipe(distinctUntilChanged());

  map: Record<keyof LangKeysContract, string> = {} as Record<
    keyof LangKeysContract,
    string
  >;

  change$ = this.change.asObservable();
  private current: LangContract = this.languages[1];
  private langMap: Record<LangCodes, LangContract> = this.languages.reduce(
    (acc, item) => {
      return { ...acc, [item.code]: item };
    },
    {} as Record<LangCodes, LangContract>
  );

  constructor(
    private _http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.setDirection(this.current.direction);
  }

  getCurrent(): LangContract {
    return this.current;
  }

  setCurrent(lang: LangContract): void {
    of(LangChangeProcess.START)
      .pipe(tap(() => this.langChangerNotifier.next(LangChangeProcess.PREPARE)))
      .pipe(map(() => lang))
      .pipe(tap(() => this.setCurrentLanguageMap()))
      .pipe(tap((lang) => this.setDirection(lang.direction)))
      .pipe(delay(1000))
      .subscribe((lang) => {
        this.current = lang;
        this.change.next(this.current);
        this.langChangerNotifier.next(LangChangeProcess.END);
      });
  }

  toggleLang(): void {
    const desiredLang = this.langMap[this.current.toggleTo];
    this.setCurrent(desiredLang);
  }

  private setDirection(direction: 'rtl' | 'ltr'): void {
    const html = this.document.querySelector('html');
    if (!html) return;
    html.dir = direction;
  }

  prepareLanguages(localizations: Localization[]): void {
    localizations.forEach((local) => {
      const key = local.localizationKey as keyof LangKeysContract;
      this.arabic[key] = local.arName;
      this.english[key] = local.enName;
    });
    this.setCurrentLanguageMap();
  }

  setCurrentLanguageMap(): void {
    this.map = this.current.code === LangCodes.AR ? this.arabic : this.english;
  }
}
