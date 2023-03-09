import { MediaQueriesContract } from '@contracts/media-queries-contract';

export interface SizeContract {
  min: number;
  max: number;
  name: keyof MediaQueriesContract;
  callback: (val: number, size: Omit<SizeContract, 'callback'>) => boolean;
}
