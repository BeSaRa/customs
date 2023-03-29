import { LangService } from '@services/lang.service';
import { NamesContract } from '@contracts/names-contract';

export interface GetNamesContract extends NamesContract {
  getNames(): string;

  getLangService(): LangService;
}
