import { TaskResponses } from '@enums/task-responses';

export interface CompleteResponse {
  selectedResponse: TaskResponses;
  comment?: string;
  decisionIds?: number[];
  userId?: number;
}
