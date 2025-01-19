import { Injectable } from '@angular/core';
import {
  AzureEndPoints,
  AzureEndpointsType,
  EndPoints,
  EndpointsType,
} from '@constants/endpoints';
import { ConfigService } from '@services/config.service';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private urls = EndPoints as EndpointsType;
  private azure_urls = AzureEndPoints as AzureEndpointsType;
  URLS: EndpointsType = {} as EndpointsType;
  AZURE_URLS: AzureEndpointsType = {} as AzureEndpointsType;
  config!: ConfigService;

  static hasTrailingSlash(url: string): boolean {
    return (url + '').indexOf('/') === (url + '').length - 1;
  }

  static hasPrefixSlash(url: string): boolean {
    return (url + '').indexOf('/') === 0;
  }

  static removeTrailingSlash(url: string): string {
    return UrlService.hasTrailingSlash(url)
      ? (url + '').substring(0, (url + '').length - 1)
      : url;
  }

  static removePrefixSlash(url: string): string {
    return UrlService.hasPrefixSlash(url)
      ? UrlService.removePrefixSlash((url + '').substring(1, (url + '').length))
      : url;
  }

  public prepareUrls(): EndpointsType {
    this.URLS.BASE_URL = UrlService.removeTrailingSlash(this.config.BASE_URL);
    for (const key in this.urls) {
      if (
        key !== 'BASE_URL' &&
        Object.prototype.hasOwnProperty.call(this.urls, key)
      ) {
        this.URLS[key as keyof EndpointsType] = this.addBaseUrl(
          this.urls[key as keyof EndpointsType],
        );
      }
    }
    return this.URLS;
  }
  public prepareAzureUrls(): AzureEndpointsType {
    this.AZURE_URLS.BASE_AZURE_URL = UrlService.removeTrailingSlash(
      this.config.AZURE_BASE_URL,
    );
    for (const key in this.azure_urls) {
      if (
        key !== 'BASE_AZURE_URL' &&
        Object.prototype.hasOwnProperty.call(this.azure_urls, key)
      ) {
        this.AZURE_URLS[key as keyof AzureEndpointsType] = this.addBaseUrl(
          this.azure_urls[key as keyof AzureEndpointsType],
          true,
        );
      }
    }
    return this.AZURE_URLS;
  }

  private addBaseUrl(url: string, azure = false): string {
    const external = (this.config.CONFIG.EXTERNAL_PROTOCOLS ?? []).some(
      protocol => {
        return url.toLowerCase().indexOf(protocol) === 0;
      },
    );
    return external
      ? url
      : azure
        ? this.AZURE_URLS.BASE_AZURE_URL +
          '/' +
          UrlService.removePrefixSlash(url)
        : this.URLS.BASE_URL + '/' + UrlService.removePrefixSlash(url);
  }

  setConfigService(service: ConfigService): void {
    this.config = service;
  }
}
