import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BlobModelContract } from '@contracts/blob-model-contract';

export class BlobModel implements BlobModelContract {
  readonly url: string;
  safeUrl: SafeResourceUrl;

  constructor(
    public blob: Blob,
    domSanitizer: DomSanitizer,
  ) {
    this.url = URL.createObjectURL(blob);
    this.safeUrl = domSanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  toFile(): File {
    const fileName = `file-${new Date()}`;
    return new File([this.blob], fileName, {
      lastModified: new Date().getTime(),
      type: this.blob.type,
    });
  }

  dispose(): void {
    URL.revokeObjectURL(this.url);
  }
}
