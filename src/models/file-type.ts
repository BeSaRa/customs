import { ClonerMixin } from '@mixins/cloner-mixin';
import { GetNamesMixin } from '@mixins/get-names-mixin';

export class FileType extends ClonerMixin(GetNamesMixin(class {})) {
  id!: number;
  updatedBy!: number;
  updatedOn!: string;
  clientData!: string;
  extension!: string;
  description!: string;
  mimeType!: string;
  size!: number;
}
