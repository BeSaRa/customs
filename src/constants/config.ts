export const Config = {
  VERSION: 'v2.0.0',
  PRIVATE_VERSION: '',
  BASE_ENVIRONMENT: '',
  AZURE_ENVIRONMENT: '',
  AZURE_X_FUNCTION_KEY: '',
  ENVIRONMENTS_URLS: {},
  API_VERSION: 'v1',
  EXTERNAL_PROTOCOLS: ['http', 'https'],
  BASE_URL: '',
  TOKEN_HEADER_KEY: 'Authorization',
  TOKEN_STORE_KEY: '$$_T_$$',
  REFRESH_TOKEN_STORE_KEY: '$$_R_$$',
  ACCESS_TOKEN_TIMEOUT_IN_MINUTES: 15,
  DATE_FORMAT: 'dd-MM-yyyy',
  DATE_FORMAT_OVERRIDE: {
    parse: {
      dateInput: 'dd-MM-yyyy',
    },
    display: {
      dateInput: 'dd-MM-yyyy',
      monthLabel: 'MMMM',
      monthYearLabel: 'MMMM - yyyy',
      dateA11yLabel: 'dd-MMMM-yyyy',
      monthYearA11yLabel: 'MMMM yyyy',
    },
  },
  E_SERVICE_ITEM_KEY: 'item',
  YEAR_RANGE_FROM_CURRENT_YEAR: 10,
  TIME_TO_RELOAD_USER_INBOX_COUNTERS: 120,
};

export type ConfigType = typeof Config;
