import { ValidationErrors } from "@angular/forms";

export type ValidationReturnType = null | ValidationErrors;

export type searchFunctionType<T = unknown> = (
  text: string,
  model: T
) => boolean;

export type ISearchFieldsMap<T = unknown> = {
  [key: string]: string | searchFunctionType<T>;
};
