import { AdminResult } from '@models/admin-result';
import { TaskState } from '@enums/task-state';
import { AssignToType } from '@enums/assign-to-type';
import { PriorityNames } from '@enums/priority-names';
import { CollaborationDetails } from '@models/collaboration-details';
import { ActionNames } from '@enums/action-names';
import { ActivityPropertiesContract } from '@contracts/activity-properties-contract';

export class TaskDetails {
  fromUserInfo!: AdminResult;
  tkiid!: string;
  isAtRisk!: string;
  priority!: number;
  name!: string;
  displayName!: string;
  owner!: string | null;
  state!: TaskState;
  status!: string;
  isReturned!: boolean;
  fromUser!: string;
  closeByUser!: string;
  assignedTo!: string;
  assignedToType!: AssignToType;
  assignedToDisplayName!: string;
  activationTime!: string;
  atRiskTime!: string;
  dueTime!: string;
  clientTypes!: string[];
  completionTime!: string;
  data!: unknown;
  description!: string;
  teamDisplayName!: string;
  lastModificationTime!: string;
  originator!: string;
  priorityName!: PriorityNames;
  processData!: unknown;
  nextTaskId!: string[];
  collaboration!: CollaborationDetails;
  startTime!: string;
  tktid!: string;
  piid!: string;
  processInstanceName!: string;
  parentCaseId!: string;
  responses!: string[];
  actions!: ActionNames[];
  isRead!: boolean;
  isMain!: boolean;
  activityProperties?: ActivityPropertiesContract;
}
