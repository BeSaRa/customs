import { CaseFolderContract } from '@contracts/case-folder-contract';
import { AdminResult } from './admin-result';
import { CaseFolderInterceptor } from '@model-interceptors/case-folder-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new CaseFolderInterceptor();

@InterceptModel({ receive, send })
export class CaseFolder implements CaseFolderContract {
  id!: string;
  createdBy!: string;
  createdOn!: string | Date;
  lastModified!: string | Date;
  lastModifier!: string;
  classDescription!: string;
  creatorInfo!: AdminResult;
  ouInfo!: AdminResult;
  name!: string;
  category!: unknown;
  offenderId!: number;
  parentFolderId!: string;
  className!: string;
}
