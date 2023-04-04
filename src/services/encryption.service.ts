import { Injectable } from '@angular/core';
import { AES, enc, MD5 } from 'crypto-js';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService extends RegisterServiceMixin(class {}) {
  encrypt<T = unknown>(model: T): string {
    const randomPrivateKey = MD5(Math.random().toString()).toString();
    return (
      AES.encrypt(JSON.stringify(model), randomPrivateKey).toString() +
      ':' +
      randomPrivateKey
    );
  }

  decrypt<T = unknown>(encryptedText: string | undefined): T {
    if (!encryptedText) {
      return null as unknown as T;
    }
    return JSON.parse(
      AES.decrypt(
        encryptedText.split(':').shift() + '',
        encryptedText.split(':').pop() + ''
      ).toString(enc.Utf8)
    );
  }
}
