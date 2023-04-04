import { AbstractConstructor, Constructor } from '@app-types/constructors';
import { GetNamesContract } from '@contracts/get-names-contract';
import { ServiceRegistry } from '@services/service-registry';
import { LangService } from '@services/lang.service';
import { NamesContract } from '@contracts/names-contract';

type CanGetNames = Constructor<GetNamesContract> &
  AbstractConstructor<GetNamesContract>;

export function GetNamesMixin<T extends AbstractConstructor<object>>(
  base: T
): CanGetNames & T;
export function GetNamesMixin<T extends Constructor<object>>(
  base: T
): CanGetNames & T {
  return class CanGetNames extends base implements GetNamesContract {
    arName!: string;
    enName!: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
    }

    getLangService(): LangService {
      return ServiceRegistry.get<LangService>('LangService');
    }

    getNames(): string {
      return this[
        (this.getLangService().getCurrent().code +
          'Name') as keyof NamesContract
      ];
    }
  };
}
