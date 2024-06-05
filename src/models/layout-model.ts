import { BaseModel } from '@abstracts/base-model';
import { LayoutService } from '@services/layout.service';
import { AdminResult } from './admin-result';

export class LayoutModel extends BaseModel<LayoutModel, LayoutService> {
  $$__service_name__$$ = 'LayoutService';

  userId!: number;

  internalUserInfo!: AdminResult;
  statusDateModified!: string;
}
