import { inject, Injectable } from '@angular/core';
import { CookieOptions, CookieService, ICookieService } from 'ngx-cookie';

import { EncryptionService } from './encryption.service';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';

@Injectable({
  providedIn: 'root',
})
export class ECookieService
  extends RegisterServiceMixin(class {})
  implements ICookieService
{
  readonly encryptedKeyPrefix = '$$';
  private readonly service = inject(CookieService);
  private readonly encryptionService = inject(EncryptionService);

  get(key: string): string | undefined {
    return this.service.get(key);
  }

  getAll(): object {
    return this.service.getAll();
  }

  getObject(key: string): object | undefined {
    return this.service.getObject(key);
  }

  hasKey(key: string): boolean {
    return this.service.hasKey(key);
  }

  put(key: string, value: string, options?: CookieOptions): void {
    return this.service.put(key, value, options);
  }

  putObject(key: string, value: object, options?: CookieOptions): void {
    return this.service.putObject(key, value, options);
  }

  remove(key: string, options?: CookieOptions): void {
    return this.service.remove(key, options);
  }

  removeE(key: string, options?: CookieOptions): void {
    this.remove(
      this.encryptedKeyPrefix + key + this.encryptedKeyPrefix,
      options
    );
  }

  removeAll(options?: CookieOptions): void {
    this.service.removeAll(options);
  }

  putE(key: string, value: string, options?: CookieOptions): void {
    this.put(
      this.encryptedKeyPrefix + key + this.encryptedKeyPrefix,
      this.encryptionService.encrypt(value),
      options
    );
  }

  getE(key: string): string | undefined {
    return this.encryptionService.decrypt(
      this.get(this.encryptedKeyPrefix + key + this.encryptedKeyPrefix)
    );
  }

  putEObject(key: string, value: object, options?: CookieOptions): void {
    return this.put(
      this.encryptedKeyPrefix + key + this.encryptedKeyPrefix,
      this.encryptionService.encrypt(value),
      options
    );
  }

  getEObject(key: string): object | undefined {
    return this.encryptionService.decrypt(
      this.get(this.encryptedKeyPrefix + key + this.encryptedKeyPrefix)
    );
  }
}
