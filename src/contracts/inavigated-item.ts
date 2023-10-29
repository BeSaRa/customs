import { OpenFrom } from '@enums/open-from';

export interface INavigatedItem {
  openFrom: OpenFrom;
  taskId: string | null;
  caseId: string;
  caseType: number;
}
