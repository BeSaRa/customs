import { AdminResult } from '@models/admin-result';

export interface CaseFolderContract {
  id: string;
  createdBy: string;
  createdOn: Date | string;
  lastModified: Date | string;
  lastModifier: string;
  classDescription: string;
  creatorInfo: AdminResult;
  ouInfo: AdminResult;
  name: string;
  category: unknown;
  offenderId: number;
  parentFolderId: string;
  className: string;
}
