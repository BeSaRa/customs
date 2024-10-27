import { ClonerMixin } from '@mixins/cloner-mixin';

export abstract class WidgetState extends ClonerMixin(class {}) {
  countersIds: number[] = [];

  buildFrom() {
    const { countersIds } = this;
    return {
      countersIds: [countersIds],
    };
  }
}
