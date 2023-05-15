import { AbstractConstructor, Constructor } from '@app-types/constructors';
import { GetLookupServiceContract } from '@contracts/get-lookup-service-contract';
import { LookupService } from '@services/lookup.service';
import { ServiceRegistry } from '@services/service-registry';

type CanGetLookupService = Constructor<GetLookupServiceContract> &
  AbstractConstructor<GetLookupServiceContract>;

export function GetLookupServiceMixin<T extends AbstractConstructor<object>>(
  base: T
): CanGetLookupService & T;
export function GetLookupServiceMixin<T extends Constructor<object>>(
  base: T
): CanGetLookupService & T {
  return class GetLookupService
    extends base
    implements GetLookupServiceContract
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
    }
    $$__lookupService__$$ = 'LookupService';

    $$getLookupService$$(): LookupService {
      return ServiceRegistry.get<LookupService>(this.$$__lookupService__$$);
    }
  };
}
