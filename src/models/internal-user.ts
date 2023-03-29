import { AdminResult } from '@models/admin-result';
import { InternalUserContract } from '@contracts/internal-user-contract';

export class InternalUser implements InternalUserContract {
  arName!: string;
  customRoleId!: number;
  defaultDepartmentInfo!: AdminResult;
  defaultOUId!: number;
  departmentInfo!: AdminResult;
  domainName!: string;
  email!: string;
  empNum!: string;
  enName!: string;
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
