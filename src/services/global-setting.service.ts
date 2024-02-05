import { Injectable } from '@angular/core';
import { GlobalSetting } from '@models/global-setting';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Observable, map, tap } from 'rxjs';
import { FileType } from '@models/file-type';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $default: {
    model: () => GlobalSetting,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => GlobalSetting,
    },
  },
})
@Injectable({
  providedIn: 'root',
})
export class GlobalSettingService extends BaseCrudService<GlobalSetting> {
  serviceName = 'GlobalSettingService';
  private _currentGlobalSettings!: GlobalSetting;

  getGlobalSettings(): GlobalSetting {
    return this._currentGlobalSettings;
  }

  setGlobalSettings(globalSettings: GlobalSetting): void {
    this._currentGlobalSettings = globalSettings;
  }
  protected getModelClass(): Constructor<GlobalSetting> {
    return GlobalSetting;
  }

  protected getModelInstance(): GlobalSetting {
    return new GlobalSetting();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.GLOBAL_SETTING;
  }

  loadCurrentGlobalSettings(): Observable<GlobalSetting> {
    return this.load().pipe(
      map(settings => settings.rs[0]),
      tap(settings => this.setGlobalSettings(settings)),
    );
  }

  @CastResponse(() => FileType, { unwrap: 'rs', fallback: '$default' })
  loadAllFileTypes(): Observable<FileType[]> {
    return this.http.get<FileType[]>(this.getUrlSegment() + '/file-types');
  }

  getAllowedFileTypes(): Observable<FileType[]> {
    return this.loadAllFileTypes().pipe(
      map(allowedFileTypes =>
        allowedFileTypes.filter(item =>
          this.getGlobalSettings().fileTypeParsed.includes(item.id.toString()),
        ),
      ),
    );
  }
}
