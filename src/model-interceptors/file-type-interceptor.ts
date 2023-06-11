import { ModelInterceptorContract } from 'cast-response';
import { FileType } from '@models/file-type';

export class FileTypeInterceptor implements ModelInterceptorContract<FileType> {
  send(model: Partial<FileType>): Partial<FileType> {
    return model;
  }

  receive(model: FileType): FileType {
    return model;
  }
}
