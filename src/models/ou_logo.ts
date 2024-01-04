import { ClonerMixin } from '@mixins/cloner-mixin';

export class OuLogo extends ClonerMixin(class {}) {
  departmentId!: number;
  content?: File;

  constructor(_ouId: number, _content: File) {
    super();
    this.departmentId = _ouId;
    this.content = _content;
  }
}
