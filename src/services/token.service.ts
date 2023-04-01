import { inject, Injectable } from '@angular/core';
import { BaseServiceMixin } from '@mixins/base-service-mixin';
import { EncryptionService } from '@services/encryption.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends BaseServiceMixin(class {}) {
  private readonly encryption = inject(EncryptionService);

  setToken(token: string) {}

  getToken(): void {}
}
