export interface ValidationMessageContract {
  key: string;

  replace?(message: string, errorValue?: any): string;
}
