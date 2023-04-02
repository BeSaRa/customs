export const Config = {
  VERSION: '',
  PRIVATE_VERSION: '',
  BASE_ENVIRONMENT: '',
  ENVIRONMENTS_URLS: {},
  API_VERSION: 'v1',
  EXTERNAL_PROTOCOLS: ['http', 'https'],
  BASE_URL: '',
  TOKEN_HEADER_KEY: 'Authorization',
  TOKEN_STORE_KEY: '$$_T_$$',
};

export type ConfigType = typeof Config;
