import { b64toBlob, generateUUID } from '@utils/utils';

export class ScanImage {
  private _imageName = '';
  private _imageAsBase64: string | null = null;

  constructor(
    private readonly _imageAsDataUrl: string,
    private readonly _mimeType: string,
    private readonly _imageData: ImageData,
  ) {
    this._imageName =
      'image-' +
      generateUUID() +
      `.${_mimeType.substring(_mimeType.indexOf('/') + 1)}`;
  }

  get imageName() {
    return this._imageName;
  }

  get mimeType() {
    return this._mimeType;
  }

  get imageAsBase64(): string {
    return this._imageAsBase64
      ? this._imageAsBase64
      : (this._imageAsBase64 = this._getDataFromDataUrl(
          this._imageAsDataUrl,
          this._mimeType,
        ));
  }

  get imageAsDataUrl(): string {
    return this._imageAsDataUrl;
  }

  get imageData(): ImageData {
    return this._imageData;
  }

  toFile() {
    return new File(
      [b64toBlob(this.imageAsBase64, this.mimeType)],
      this.imageName,
      {
        type: this.mimeType,
      },
    );
  }

  private _getDataFromDataUrl(dataUrl: string, mimeType: string) {
    return dataUrl.replace(`data:${mimeType};base64,`, '');
  }
}
