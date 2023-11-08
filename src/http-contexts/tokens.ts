import { HttpContextToken } from '@angular/common/http';

export const NO_LOADER_TOKEN = new HttpContextToken(() => false);
