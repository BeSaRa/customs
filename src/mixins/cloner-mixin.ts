import { AbstractConstructor, Constructor } from '@app-types/constructors';
import { CloneContract } from '@contracts/clone-contract';

type CanClone = Constructor<CloneContract> & AbstractConstructor<CloneContract>;

export function ClonerMixin<T extends AbstractConstructor<object>>(
  base: T
): CanClone & T;
export function ClonerMixin<T extends Constructor<object>>(
  base: T
): CanClone & T {
  return class CanClone extends base implements CloneContract {
    clone<M extends object>(overrides?: Partial<M>): M {
      const constructor = this.constructor as Constructor<M>;
      return Object.assign(new constructor(), this, overrides);
    }
  };
}
