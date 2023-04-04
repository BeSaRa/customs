import { HasServiceNameContract } from '@contracts/has-service-name-contract';

export interface BaseModelContract extends HasServiceNameContract {
  id: number;
  arName: string;
  enName: string;
  updatedBy: number;
  updatedOn: string;
  clientData: string;
}
