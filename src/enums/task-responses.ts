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
  PA_LAUNCH_LEGAL_AFFAIRS = 'pa_launch_legal_affairs',
  PA_FNL_TO_PAE = 'pa_fnl_to_pae',
  PA_FNL_COMPLETE = 'pa_fnl_complete',
  PA_FNL_APPLY_AND_RETURN = 'pa_fnl_apply_and_return',
  PA_FNL_LAUNCH_LEGAL_AFFAIRS = 'pa_fnl_launch_legal_affairs', // إلى الشؤون القانونية
  PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL = 'pa_fnl_launch_disciplinary_council', // المجلس التأديبي
  PA_FNL_LAUNCH_PERMANENT_DISCIPLINARY_COUNCIL = 'pa_fnl_launch_permanent_disciplinary_council', // المجلس التأديبي الدائم
  CHIEF_APPROVE = 'chief_approve',
}
