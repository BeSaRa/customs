import { CloneContract } from '@contracts/clone-contract';
import { Constructor } from '@app-types/constructors';

export abstract class Cloner implements CloneContract {
  clone<T extends object>(override?: Partial<T>): T {
    const constructor = this.constructor as Constructor<T>;
    return Object.assign(new constructor(), this, override);
  }
}
