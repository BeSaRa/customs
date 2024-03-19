import { UserTypes } from '@enums/user-types';

export interface ExternalCredentialsContract {
  qid: string;
  userType: UserTypes;
  licenseNo: string;
}
