import { BaseModel } from '@abstracts/base-model';
import { FileTypeService } from '@services/file-type.service';
import { FileTypeInterceptor } from '@model-interceptors/file-type-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new FileTypeInterceptor();

@InterceptModel({ send, receive })
export class FileType extends BaseModel<FileType, FileTypeService> {
  $$__service_name__$$ = 'FileTypeService';

  buildForm(controls = false): object {
    return {};
  }
}
