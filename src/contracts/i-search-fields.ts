import { searchFunctionType } from '@app-types/validation-return-type';

export interface ISearchFields<T> {
  searchFields: { [key: string]: searchFunctionType<T> | string }
}
