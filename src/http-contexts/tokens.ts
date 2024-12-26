import { HttpContextToken } from '@angular/common/http';

export const NO_LOADER_TOKEN = new HttpContextToken(() => false);
export const NO_ERROR_HANDLE = new HttpContextToken(() => false);
export const IS_REFRESH = new HttpContextToken(() => false);
