import { OpenFrom } from '@enums/open-from';
import { Investigation } from '@models/investigation';

export interface INavigatedItem {
  openFrom: OpenFrom;
  taskId: string | null;
  caseId: string;
  caseType: number;
  searchCriteria?: Investigation;
}
