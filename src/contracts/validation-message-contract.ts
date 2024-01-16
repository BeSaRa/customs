export interface ValidationMessageContract {
  key: string;

  replace?(message: string, errorValue?: unknown): string;
}
