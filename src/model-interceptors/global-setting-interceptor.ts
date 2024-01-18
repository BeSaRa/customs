import { isValidValue } from '@utils/utils';
import { ModelInterceptorContract } from 'cast-response';
import { GlobalSetting } from '@models/global-setting';

export class GlobalSettingInterceptor
  implements ModelInterceptorContract<GlobalSetting>
{
  send(model: Partial<GlobalSetting>): Partial<GlobalSetting> {
    GlobalSettingInterceptor.stringifyFileTypes(model);
    GlobalSettingInterceptor.stringifyEmailList(model);
    GlobalSettingInterceptor._deleteBeforeSend(model);
    return model;
  }

  receive(model: GlobalSetting): GlobalSetting {
    GlobalSettingInterceptor.parseFileTypes(model);
    GlobalSettingInterceptor.parseEmailList(model);
    return model;
  }
  private static stringifyFileTypes(model: Partial<GlobalSetting>): void {
    model.fileType = JSON.stringify(
      (model.fileTypeParsed ?? []).filter((fileType) => isValidValue(fileType)),
    );
  }
  private static parseFileTypes(model: GlobalSetting): void {
    try {
      model.fileTypeParsed = JSON.parse(model.fileType);
    } catch (error) {
      model.fileTypeParsed = [];
    }
  }
  private static stringifyEmailList(model: Partial<GlobalSetting>) {
    model.supportEmailList = JSON.stringify(
      (model.supportEmailListParsed ?? []).filter((email) =>
        isValidValue(email),
      ),
    );
  }
  private static parseEmailList(model: GlobalSetting): void {
    try {
      model.supportEmailListParsed = JSON.parse(model.supportEmailList);
    } catch (error) {
      model.supportEmailListParsed = [];
    }
  }

  static _deleteBeforeSend(model: Partial<GlobalSetting>) {
    delete model.fileTypeParsed;
    delete model.supportEmailListParsed;
  }
}
