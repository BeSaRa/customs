import { ModelInterceptorContract } from 'cast-response';
import { CaseFolder } from '@models/case-folder';

export class CaseFolderInterceptor
  implements ModelInterceptorContract<CaseFolder>
{
  send(model: Partial<CaseFolder>): Partial<CaseFolder> {
    return model;
  }

  receive(model: CaseFolder): CaseFolder {
    return model;
  }
}
