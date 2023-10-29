import { ValidationErrors } from '@angular/forms';

export type ValidationReturnType = null | ValidationErrors;

export type searchFunctionType<T = any> = (text: string, model: T) => boolean;

export type ISearchFieldsMap<T = any> = { [key: string]: string | searchFunctionType<T> };
