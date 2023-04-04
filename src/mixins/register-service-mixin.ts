import { AbstractConstructor, Constructor } from '@app-types/constructors';
import { ServiceRegistry } from '@services/service-registry';

export function RegisterServiceMixin<T extends AbstractConstructor<object>>(
  base: T
): T;
export function RegisterServiceMixin<T extends Constructor<object>>(
  base: T
): T {
  return class BaseServiceMixin extends base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
      this.$__init__$();
    }

    private $__init__$() {
      Promise.resolve().then(() => {
        ServiceRegistry.set(this.constructor.name, this);
      });
    }
  };
}
