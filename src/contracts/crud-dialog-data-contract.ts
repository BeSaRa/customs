import { OperationType } from '@enums/operation-type';

export interface CrudDialogDataContract<M> {
  model: M;
  operation: OperationType;
  extras?: {
    [index: string]: unknown;
  };
}
