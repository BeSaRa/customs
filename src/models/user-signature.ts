import { ClonerMixin } from '@mixins/cloner-mixin';

export class UserSignature extends ClonerMixin(class {}) {
  userId!: number;
  content?: File;

  constructor(_userId: number, _content: File) {
    super();
    this.userId = _userId;
    this.content = _content;
  }
}
