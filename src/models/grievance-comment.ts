import { ClonerMixin } from '@mixins/cloner-mixin';

export class GrievanceComment extends ClonerMixin(class {}) {
  comment!: string;
  commentDate!: string | Date;
}
