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

  private prepareUrlsGeneric<T>(baseUrl: string, urls: T, isAzure = false): T {
    const preparedUrls = { ...urls };
    (preparedUrls as any).BASE_URL = UrlService.removeTrailingSlash(baseUrl);

    for (const key in urls) {
      if (
        key !== 'BASE_URL' &&
        Object.prototype.hasOwnProperty.call(urls, key)
      ) {
        (preparedUrls as any)[key] = this.addBaseUrl(
          baseUrl,
          (urls as any)[key],
        );
      }
    }
    return preparedUrls;
  }

  public prepareUrls(): EndpointsType {
    this.URLS = this.prepareUrlsGeneric<EndpointsType>(
      this.config.BASE_URL,
      this.urls,
    );
    return this.URLS;
  }

  public prepareAzureUrls(): AzureEndpointsType {
    this.AZURE_URLS = this.prepareUrlsGeneric<AzureEndpointsType>(
      this.config.AZURE_BASE_URL,
      this.azure_urls,
      true,
    );
    return this.AZURE_URLS;
  }

  private addBaseUrl(baseUrl: string, url: string): string {
    const external = (this.config.CONFIG.EXTERNAL_PROTOCOLS ?? []).some(
      protocol => {
        return url.toLowerCase().indexOf(protocol) === 0;
      },
    );
    return external ? url : baseUrl + '/' + UrlService.removePrefixSlash(url);
  }

  setConfigService(service: ConfigService): void {
    this.config = service;
  }
}
