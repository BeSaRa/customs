export const EndPoints = {
  BASE_URL: '',
  INFO: '/auth/login/info',
  LOCALIZATION: '/entity/localization',
  AUTH: '/auth/internal/login',
  VALIDATE_TOKEN: '/auth/validate-token',
  PERMISSION: '/entity/permission',
  INTERNAL_USER: '/entity/internal/user',
  USER_PREFERENCES:'/entity/user-preferences'
};

export type EndpointsType = typeof EndPoints;
