import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { MediaDevicesErrors } from '@enums/media-devices-errors';
import { ScanImage } from '@models/scan-image';
import { LangService } from '@services/lang.service';
import { ScanImageService } from '@services/scan-image.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ImagesListComponent } from '@standalone/components/images-list/images-list.component';

@Component({
  selector: 'app-scan-popup',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    ButtonComponent,
    MatDialogModule,
    ImagesListComponent,
    MatIconModule,
  ],
  templateUrl: './scan-popup.component.html',
  styleUrl: './scan-popup.component.scss',
})
export class ScanPopupComponent implements OnInit, OnDestroy {
  lang = inject(LangService);
  scanService = inject(ScanImageService);
  dialogRef = inject(MatDialogRef);

  allowCameraSwitch: boolean = true;
  mirrorImage: string | { x: string } = 'auto';
  imageType: string = 'image/jpeg';
  imageQuality: number = 0.92;

  videoInitialized: boolean = false;

  images: ScanImage[] = [];
  mediaError?: MediaDevicesErrors;

  activeVideoInputIndex: number = -1;
  mediaStream?: MediaStream;
  video: Signal<ElementRef<HTMLVideoElement> | undefined> = viewChild('video');
  canvas: Signal<ElementRef<HTMLCanvasElement> | undefined> =
    viewChild('canvas');

  readonly MediaDevicesErrors = MediaDevicesErrors;

  ngOnInit(): void {
    this.connentToVideoInput();
  }

  connentToVideoInput(deviceId?: string): void {
    this.videoInitialized = false;
    this._stopMediaTracks();
    this.initCam(deviceId);
  }

  private initCam(deviceId?: string) {
    this.mediaError = undefined;
    const _video = this.video()!.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
        })
        .then(stream => {
          this.mediaStream = stream;
          _video.srcObject = stream;
          _video.play();

          const activeDeviceId =
            this._getDeviceIdFromMediaStreamTrack(stream.getVideoTracks()[0]) ??
            undefined;

          this.activeVideoInputIndex = activeDeviceId
            ? (this.scanService.availableMediaDevices() ?? []).findIndex(
                (mediaDeviceInfo: MediaDeviceInfo) =>
                  mediaDeviceInfo.deviceId === activeDeviceId,
              )
            : -1;
          this.videoInitialized = true;
        })
        .catch((err: DOMException) => {
          this.mediaError = err.name as MediaDevicesErrors;
        });
    } else {
      this.mediaError = MediaDevicesErrors.NOT_SUPPORTED_ERROR;
    }
  }

  capture(): void {
    const _video = this.video()!.nativeElement;
    const _canvas = this.canvas()!.nativeElement;

    const context2d = _canvas.getContext('2d');
    context2d!.drawImage(_video!, 0, 0);

    const dataUrl: string = _canvas.toDataURL(
      this.imageType,
      this.imageQuality,
    );

    const imageData = context2d!.getImageData(
      0,
      0,
      _canvas.width,
      _canvas.height,
    );

    this.images = [
      ...this.images,
      new ScanImage(dataUrl, this.imageType, imageData),
    ];
  }

  switchVideoInput() {
    if (
      this.scanService.availableMediaDevices() &&
      this.scanService.availableMediaDevices()!.length > 1
    ) {
      const nextInputIndex =
        (this.activeVideoInputIndex + 1) %
        this.scanService.availableMediaDevices()!.length;
      this.connentToVideoInput(
        this.scanService.availableMediaDevices()?.[nextInputIndex].deviceId,
      );
    }
  }

  saveImages() {
    if (!this.images.length) return;
    this.dialogRef.close(this.images.map(i => i.toFile()));
  }

  removeImage(imageName: string) {
    this.images = this.images.filter(image => image.imageName !== imageName);
  }

  getErrorIcon() {
    return this.mediaError === MediaDevicesErrors.NOT_ALLOWED_ERROR
      ? AppIcons.BLOCK
      : this.mediaError === MediaDevicesErrors.NOT_FOUND_ERROR
        ? AppIcons.ALERT
        : this.mediaError === MediaDevicesErrors.NOT_SUPPORTED_ERROR
          ? AppIcons.ALERT
          : AppIcons.ERROR;
  }

  ngOnDestroy(): void {
    this._stopMediaTracks();
  }

  private _stopMediaTracks() {
    if (this.mediaStream && this.mediaStream.getTracks) {
      this.video()?.nativeElement.pause();
      this.mediaStream
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
    }
  }

  private _getDeviceIdFromMediaStreamTrack(mediaStreamTrack: MediaStreamTrack) {
    if (
      mediaStreamTrack.getSettings &&
      mediaStreamTrack.getSettings() &&
      mediaStreamTrack.getSettings().deviceId
    ) {
      return mediaStreamTrack.getSettings().deviceId;
    } else if (
      mediaStreamTrack.getConstraints &&
      mediaStreamTrack.getConstraints() &&
      mediaStreamTrack.getConstraints().deviceId
    ) {
      const deviceIdObj = mediaStreamTrack.getConstraints().deviceId;
      return this._getValueFromConstrainDOMString(deviceIdObj);
    }
    return undefined;
  }

  private _getValueFromConstrainDOMString(
    constrainDOMString?: ConstrainDOMString,
  ) {
    if (constrainDOMString) {
      if (typeof constrainDOMString === 'string') {
        return constrainDOMString;
      } else if (
        Array.isArray(constrainDOMString) &&
        Array(constrainDOMString).length > 0
      ) {
        return constrainDOMString[0];
      } else {
        if (Object.keys(constrainDOMString).find(k => k === 'exact')) {
          return constrainDOMString['exact' as keyof typeof constrainDOMString];
        } else if (Object.keys(constrainDOMString).find(k => k === 'ideal')) {
          return constrainDOMString['ideal' as keyof typeof constrainDOMString];
        }
      }
    }

    return null;
  }
}
