import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Config, ConfigType } from '@constants/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  CONFIG: ConfigType = Config;
  BASE_URL = '';
  AZURE_BASE_URL = '';

  load(): Observable<ConfigType> {
    return this.http
      .get<ConfigType>('CONFIGURATIONS.json')
      .pipe(tap(res => (this.CONFIG = { ...this.CONFIG, ...res })))
      .pipe(tap(() => this.prepareBaseUrl()))
      .pipe(tap(() => this.prepareAzureBaseUrl()));
  }

  private prepareBaseUrlGeneric(
    environmentKey: 'BASE_ENVIRONMENT' | 'AZURE_ENVIRONMENT',
    baseUrlKey: 'BASE_URL' | 'AZURE_BASE_URL',
  ): string {
    if (
      !Object.prototype.hasOwnProperty.call(this.CONFIG, 'ENVIRONMENTS_URLS') ||
      !Object.keys(this.CONFIG.ENVIRONMENTS_URLS).length
    ) {
      throw Error(
        'There is no ENVIRONMENTS_URLS property or it is empty in app-configuration.json file. Please check it.',
      );
    }

    if (typeof this.CONFIG[environmentKey] === 'undefined') {
      throw Error(
        `The environment key "${environmentKey}" is not provided in app-configuration.json file.`,
      );
    }

    const baseUrl =
      this.CONFIG.ENVIRONMENTS_URLS[
        this.CONFIG[
          environmentKey as keyof typeof this.CONFIG.ENVIRONMENTS_URLS
        ]
      ];

    if (typeof baseUrl === 'undefined') {
      throw Error(
        `The environment "${this.CONFIG[environmentKey]}" does not exist in ENVIRONMENTS_URLS in app-configuration.json file.`,
      );
    }

    let fullUrl: string = baseUrl;

    if (
      Object.prototype.hasOwnProperty.call(this.CONFIG, 'API_VERSION') &&
      this.CONFIG.API_VERSION
    ) {
      if (fullUrl.lastIndexOf('/') !== fullUrl.length - 1) {
        fullUrl += '/';
      }
      fullUrl += this.CONFIG.API_VERSION;
    }

    this[baseUrlKey] = fullUrl;
    return fullUrl;
  }

  public prepareBaseUrl(): string {
    return this.prepareBaseUrlGeneric('BASE_ENVIRONMENT', 'BASE_URL');
  }

  public prepareAzureBaseUrl(): string {
    return this.prepareBaseUrlGeneric('AZURE_ENVIRONMENT', 'AZURE_BASE_URL');
  }
}
