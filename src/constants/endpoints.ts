export const EndPoints = {
  BASE_URL: '',
  INFO: '/auth/login/info',
  LOCALIZATION: '/entity/localization',
  AUTH: '/auth/internal/login',
  VALIDATE_TOKEN: '/auth/validate-token',
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
  BROKER_COMPANY: '/entity/brokerage-company',
  ORGANIZATION_UNIT: '/entity/organization-unit',
  MAWARED_DEPARTMENT: '/entity/mawared-department',
  MAWARED_EMPLOYEE: '/entity/mawared-employee',
  BROKER: '/entity/broker',
  SERVICES: '/entity/services',
  SERVICE_STEPS: '/entity/service-steps',
  EMAIL_TEMPLATE: '/entity/email-template',
  GLOBAL_SETTING: '/admin/global-setting',
  FILE_TYPE: '/admin/global-setting/file-types',
  INVESTIGATION: '/investigation-case',
  USER_INBOX: '/inbox/team/3',
  VIOLATION_PENALTY: '/entity/violation-penalty',
  LEGAL_RULE: '/entity/legal-rule',
  ATTACHMENT_TYPE: '/entity/attachment-type',
  INTERNAL_USER_OU: '/entity/internal-user-ou',
  VIOLATION: 'entity/violation',
  REFRESH_CACHE: '/admin/config/refresh-cache',
};

export type EndpointsType = typeof EndPoints;
