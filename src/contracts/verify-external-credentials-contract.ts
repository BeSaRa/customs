export interface VerifyExternalCredentialsContract {
  qid: string;
  mfaToken: string;
  otp: string;
  userType: number;
  eId: string;
}
