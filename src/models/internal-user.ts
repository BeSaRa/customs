import { AdminResult } from '@models/admin-result';
import { InternalUserContract } from '@contracts/internal-user-contract';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { CloneContract } from '@contracts/clone-contract';

export class InternalUser
  extends GetNamesMixin(ClonerMixin(class {}))
  implements InternalUserContract, GetNamesContract, CloneContract
{
  customRoleId!: number;
  defaultDepartmentInfo!: AdminResult;
  defaultOUId!: number;
  departmentInfo!: AdminResult;
  domainName!: string;
  email!: string;
  empNum!: string;
  id!: number;
  jobTitle!: number;
  jobTitleInfo!: AdminResult;
  officialPhoneNumber!: string;
  phoneExtension!: string;
  phoneNumber!: string;
  qid!: string;
  status!: number;
  statusInfo!: AdminResult;
  updatedBy!: string;
  updatedOn!: unknown;
}
