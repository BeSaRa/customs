import { OperationType } from '@enums/operation-type';

export interface CrudDialogDataContract<M, E = { [index: string]: unknown }> {
  model: M;
  operation: OperationType;
  extras?: E;
}
