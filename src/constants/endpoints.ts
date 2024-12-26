export const EndPoints = {
  BASE_URL: '',
  INFO: '/auth/login/info',
  LOCALIZATION: '/entity/localization',
  COMMON: '/common',
  AUTH: '/auth/internal/login',
  AUTH_EXTERNAL: '/auth/external/login',
  AUTH_CLEARING_AGENCY: '/auth/external/login/clearing-agency',
  AUTH_VERIFY: '/auth/external/verify',
  AUTH_CLEARING_AGENCY_VERIFY: '/auth/external/clearing-agency/verify',
  SWITCH_ORGANIZATION: '/auth/internal/organization-unit',
  VALIDATE_TOKEN: '/auth/validate-token',
  REFRESH_TOKEN: '/auth/refresh-token',
  PERMISSION: '/entity/permission',
  INTERNAL_USER: '/entity/internal/user',
  USER_PREFERENCES: '/entity/user-preferences/internal-user-id',
  USER_PERMISSION: '/entity/internal-user-permission',
  TEAM: '/entity/baw/team',
  PENALTY: '/entity/penalty',
  VIOLATION_CLASSIFICATION: '/entity/violation-classification',
  VIOLATION_TYPE: '/entity/violation-type',
  JOB_TITLE: '/entity/job-title',
  PERMISSION_ROLE: '/entity/permission-role',
  ORGANIZATION_UNIT: '/entity/organization-unit',
  MAWARED_DEPARTMENT: '/entity/mawared-department',
  MAWARED_EMPLOYEE: '/entity/mawared-employee',
  SERVICES: '/entity/services',
  SERVICE_STEPS: '/entity/service-steps',
  EMAIL_TEMPLATE: '/entity/email-template',
  GLOBAL_SETTING: '/admin/global-setting',
  FILE_TYPE: '/admin/global-setting/file-types',
  INVESTIGATION: '/investigation-case',
  USER_INBOX: '/inbox/user',
  TEAM_INBOX: '/inbox/team',
  TASK_INBOX: '/inbox/task',
  VIOLATION_PENALTY: '/entity/violation-penalty',
  LEGAL_RULE: '/entity/legal-rule',
  ATTACHMENT_TYPE: '/entity/attachment-type',
  INTERNAL_USER_OU: '/entity/internal-user-ou',
  VIOLATION: 'entity/violation',
  REFRESH_CACHE: '/admin/config/refresh-cache',
  OFFENDER: '/entity/offender',
  OFFENDER_VIOLATION: '/entity/offender-violation',
  GUIDE_PANEL: '/entity/violation-penalty/guide-panel',
  WITNESS: '/entity/witness',
  PENALTY_DECISION: '/entity/penalty-decision',
  SITUATION_SEARCH: '/entity/offender-violation/situation-search',
  USER_TEAM: '/entity/baw/team/user-teams',
  CLEARING_AGENT: '/entity/clearing-agent',
  CLEARING_AGENCY: '/entity/clearing-agency',
  SUSPENDED_EMPLOYEE: '/entity/suspended-employee',
  RELEASE_BULK: '/inbox/task/return/bulk',
  CHAT: '/openai/chat',
  CALL_REQUEST: '/entity/obligation-to-attend',
  INVESTIGATION_REPORT: '/entity/administrative-investigation-report',
  MEETING: '/entity/meeting',
  GRIEVANCE: '/grievance-case',
  MANAGER_DELEGATION: '/entity/manager-delegation',
  WIDGET: '/entity/widget',
  LAYOUT: '/entity/layout',
  LAYOUT_WIDGET: '/entity/layout-widget',
  OFFLINE_PAYMENT: '/internal/offline/payment',
  INVESTIGATION_SEARCH: '/investigation-case/search/criteria',
  CASE_ENTITY_VIEW: '/investigation-case/search/criteria',
  COURT_DECISION: '/court-decision-case', // until implemented from BE side
  CUSTOM_MENU: '/entity/menu-item',
  REQUEST_STATEMENT: '/investigation-case/statement-review',
  GRIEVANCE_REQUEST_STATEMENT: '/grievance-case/statement-review',
  USER_GUIDE: '/entity/user-guide',
  INBOX_COUNTER: 'entity/counter-team',
  USER_MENU_ITEM: 'entity/user-menu-item',
  USER_DELEGATION: '/entity/user-delegation',
};
export const AzureEndPoints = {
  BASE_URL: '',
  ALL_CONVERSATIONS: '/chat-history/all-conversations',
  SEARCH_WEBSITE: '/search/search/website',
  CHAT_BOT_WEBSITE: '/chatbot/chat/website',
  ADD_FEEDBACK: '/chat-history/add-feedback',
  SPEECH_TOKEN: '/speech/token',
};

export type EndpointsType = typeof EndPoints;
export type AzureEndpointsType = typeof AzureEndPoints;
