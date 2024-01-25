import { GetNamesContract } from '@contracts/get-names-contract';
import { NamesContract } from '@contracts/names-contract';
import { AssignedToInterceptor } from '@model-interceptors/assigned-to-interceptor';
import { LangService } from '@services/lang.service';
import { ServiceRegistry } from '@services/service-registry';
import { InterceptModel } from 'cast-response';

const { send, receive } = new AssignedToInterceptor();

@InterceptModel({ send, receive })
export class AssignedTo implements GetNamesContract {
  getLangService(): LangService {
    return ServiceRegistry.get<LangService>('LangService');
  }
  tkiid!: string;
  name!: string;
  pId!: string;
  type!: string;
  arName!: string;
  enName!: string;
  departmentId!: number;
  piName!: string;
  stepSubject!: string;
  startDate!: string;
  isMain!: false;
  getNames(): string {
    return this[
      (this.getLangService().getCurrent().code + 'Name') as keyof NamesContract
    ];
  }
}
