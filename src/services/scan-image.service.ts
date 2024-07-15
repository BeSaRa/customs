import { computed, Injectable, signal } from '@angular/core';
import { catchError, from, map, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScanImageService {
  private _availableMediaDevices = signal<MediaDeviceInfo[] | undefined>([]);
  availableMediaDevices = computed(() => this._availableMediaDevices());

  constructor() {
    this._setAvailableVideoInputs();
    this._listenToMediaDevicesChange();
  }

  private _listenToMediaDevicesChange() {
    navigator.mediaDevices.addEventListener('devicechange', () => {
      this._setAvailableVideoInputs();
    });
  }

  private _setAvailableVideoInputs = () => {
    from(navigator.mediaDevices.enumerateDevices())
      .pipe(take(1))
      .pipe(
        map(devices => devices.filter(d => d.kind === 'videoinput')),
        catchError(() => of(undefined)),
      )
      .subscribe(devices => this._availableMediaDevices.set(devices));
  };
}
