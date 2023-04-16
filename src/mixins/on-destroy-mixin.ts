import { AbstractConstructor, Constructor } from '@app-types/constructors';
import { HasDestroySubjectContract } from '@contracts/has-destroy-subject-contract';
import { Subject } from 'rxjs';

type CanDestroy = Constructor<HasDestroySubjectContract> &
  AbstractConstructor<HasDestroySubjectContract>;

export function OnDestroyMixin<T extends AbstractConstructor<object>>(
  base: T
): CanDestroy & T;
export function OnDestroyMixin<T extends Constructor<object>>(
  base: T
): CanDestroy & T {
  return class HasDestroySubject
    extends base
    implements HasDestroySubjectContract
  {
    destroy$: Subject<void> = new Subject<void>();

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
      this.destroy$.unsubscribe();
    }
  };
}
