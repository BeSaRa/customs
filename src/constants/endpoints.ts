export const EndPoints = {
  BASE_URL: '',
  INFO: '/auth/login/info',
  LOCALIZATION: '/entity/localization',
  AUTH: '/auth/internal/login',
  VALIDATE_TOKEN: '/auth/validate-token',
  PERMISSION: '/entity/permission',
  VIOLATION_CLASSIFICATION: '/entity/violation-classification',
  VIOLATION_TYPE: '/entity/violation-type',
};

export type EndpointsType = typeof EndPoints;
