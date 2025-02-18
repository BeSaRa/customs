export enum TaskResponses {
  TO_USER = 'to_user', //
  RETURN_TO_APP = 'return_to_app',
  RETURN_TO_SAME = 'return_to_same',
  MANAGER_APPROVE = 'manager_approve',
  TO_MANAGER = 'to_manager', // form 1
  TO_CHIEF = 'to_chief',
  REFERRAL_TO_PRESIDENT = 'referral_to_president', // form 3
  REFERRAL_TO_PRESIDENT_ASSISTANT = 'referral_to_president_assistant', // form 3
  CLOSE = 'close',
  RETURN_APP_MANAGER = 'return_app_manager',
  PR_LAUNCH_LEGAL_AFFAIRS = 'pr_launch_legal_affairs',
  TO_PO = 'to_po',
  TERMINATE = 'terminate',
  LAUNCH_LEGAL_AFFAIRS = 'launch_legal_affairs',
  COMPLETE = 'complete',
  RETURN_TO_HR = 'return_to_hr',
  HR_APPROVE = 'hr_approve',
  TO_PAE = 'to_pae',
  PRESIDENT_ASSISTANT_LAUNCH_LEGAL_AFFAIRS = 'pa_launch_legal_affairs',
  PA_FNL_TO_PAE = 'pa_fnl_to_pae',
  PA_FNL_COMPLETE = 'pa_fnl_complete',
  PA_FNL_APPLY_AND_RETURN = 'pa_fnl_apply_and_return',
  PA_FNL_LAUNCH_LEGAL_AFFAIRS = 'pa_fnl_launch_legal_affairs', // إلى الشؤون القانونية
  PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL = 'pa_fnl_launch_disciplinary_council', // المجلس التأديبي
  PA_FNL_LAUNCH_PERMANENT_DISCIPLINARY_COUNCIL = 'pa_fnl_launch_permanent_disciplinary_council', // المجلس التأديبي الدائم
  CHIEF_APPROVE = 'chief_approve',
  TO_INV = 'to_inv',
  TO_FNL_LA = 'to_fnl_la',
  TO_INV_USER = 'to_inv_user',
  TO_INV_CHIEF = 'to_inv_chief',
  LA_FNL_APPROVE = 'la_fnl_approve',
  DC_RETURN_PA = 'dc_return_pa',
  PA_FNL_LAUNCH_DC = 'pa_fnl_launch_dc',
  TO_HR_DEP = 'to_hr_dep',
  CA_APPROVE = 'ca_approve',
  RETURN_TO_CA = 'return_to_ca',
  TO_CA_DEP = 'to_ca_dep',
  DC_SIGN = 'dc_sign',
  DC_DECISION_SIGN = 'dc_decision_sign',
  RETURN_TO_PR = 'return_to_pr',
  RETURN_TO_PA = 'return_to_pa',
  ASK_ANOTHER_DEPARTMENT = 'ask:ReviewDepartmentStatement', // طلب الافادة من ادارة اخري
  TO_LA = 'to_la', // اعادة إلى مدير الشؤن القانونية
  TO_HR_USER = 'to_hr_user', //اختيار موظف للارشفة في موارد
  RETURN_TO_SAME_HR = 'return_to_same_hr', //اختيار موظف للارشفة في موارد
  PA_FRST_APPROVE = 'pa_frst_approve',
  PR_FRST_APPROVE = 'pr_frst_approve',
  RETURN_TO_PO = 'return_to_po',
  RETURN_TO_PAE = 'return_to_pae',
  GR_COMPLETE = 'gr_complete',
  TO_PO_USER = 'to_po_user',
  TO_PAO_USER = 'to_pao_user',
  STM_RETURN_CREATOR = 'stm_return_creator',
  STM_DEP_APPROVE = 'stm_dep_approve',
  STM_CLOSE = 'stm_close',
  STM_REPLY = 'stm_reply',
  STM_DEST_CLOSE = 'stm_dest_close',
  STM_COMPLETE = 'stm_complete',
  APPROVE_MODIFICATION = 'approve_modification',
  REASSIGN = 'reassign',
  TO_PA = 'to_pa',
  TO_PA_USER = 'to_pa_user',
  TO_PR = 'to_pr',
  TO_PR_USER = 'to_pr_user',
}
