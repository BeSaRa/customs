export interface ValidationMessageContract {
  key: string;

  replace?(message: string): string;
}
