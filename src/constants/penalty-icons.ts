import { SystemPenalties } from '@enums/system-penalties';
import { AppIcons } from '@constants/app-icons';

export const PenaltyIcons: Record<SystemPenalties, string> = {
  [SystemPenalties.TERMINATE]: AppIcons.STOP,
  [SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT]:
    AppIcons.ACCOUNT_ARROW_LEFT_OUTLINE,
  [SystemPenalties.REFERRAL_TO_PRESIDENT]: AppIcons.ACCOUNT_ARROW_LEFT,
  [SystemPenalties.REFERRAL_DISCIPLINARY_COMMITTEE]:
    AppIcons.REFERRAL_DISCIPLINARY_COMMITTEE,
  [SystemPenalties.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL]:
    AppIcons.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL,
  [SystemPenalties.SAVE]: AppIcons.CONTENT_SAVE_OUTLINE,
  [SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS]: AppIcons.SCALE_BALANCE,
};
