import { AbstractConstructor, Constructor } from '@app-types/constructors';
import { ServiceRegistry } from '@services/service-registry';
import { HasServiceNameContract } from '@contracts/has-service-name-contract';

type CanGetService = Constructor<HasServiceNameContract> &
  AbstractConstructor<HasServiceNameContract>;
export function HasServiceMixin<M extends AbstractConstructor<object>>(
  base: M
): CanGetService & M;
export function HasServiceMixin<M extends Constructor<object>>(
  base: M
): CanGetService & M {
  return class HasService extends base implements HasServiceNameContract {
    $$__service_name__$$!: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
    }

    $$getService$$<S>(): S {
      return ServiceRegistry.get<S>(this.$$__service_name__$$);
    }
  };
}
