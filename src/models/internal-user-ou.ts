import { BaseModel } from '@abstracts/base-model';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { InternalUserOUInterceptor } from '@model-interceptors/internal-user-ou-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { NamesContract } from '@contracts/names-contract';

const { send, receive } = new InternalUserOUInterceptor();

@InterceptModel({ send, receive })
export class InternalUserOU extends BaseModel<
  InternalUserOU,
  InternalUserOUService
> {
  $$__service_name__$$ = 'InternalUserOUService';
  internalUserId!: number;
  internalUserInfo!: AdminResult;
  organizationUnitId!: number;
  organizationUnitInfo!: AdminResult;
  organizationUnitArray!: number[];
  administrationAndSectionUnit!: number;
  permissionRoleId!: number;
  override status = 1;

  buildForm(controls = false): object {
    const {
      internalUserId,
      organizationUnitArray,
      administrationAndSectionUnit,
      status,
    } = this;
    return {
      internalUserId: controls
        ? [internalUserId, [CustomValidators.required]]
        : internalUserId,
      organizationUnitArray: controls
        ? [organizationUnitArray]
        : organizationUnitArray,
      administrationAndSectionUnit: controls
        ? [administrationAndSectionUnit, [CustomValidators.required]]
        : administrationAndSectionUnit,
      status: controls ? [status] : status,
    };
  }

  getOUUserNames(): string {
    try {
      return this.internalUserInfo[
        (this.getLangService().getCurrent().code +
          'Name') as keyof NamesContract
      ];
    } catch (e) {
      return 'lang service not ready yet';
    }
  }
  override getNames(): string {
    try {
      return this.organizationUnitInfo[
        (this.getLangService().getCurrent().code +
          'Name') as keyof NamesContract
      ];
    } catch (e) {
      return 'lang service not ready yet';
    }
  }
}
