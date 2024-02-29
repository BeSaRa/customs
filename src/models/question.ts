import { ClonerMixin } from '@mixins/cloner-mixin';

export class Question extends ClonerMixin(class {}) {
  id!: number;
  question!: string;
  answer!: string;
}
