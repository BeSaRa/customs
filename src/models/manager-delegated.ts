import { InternalUser } from '@models/internal-user';

export class ManagerDelegated extends InternalUser {
  isDelegated!: boolean;
}
