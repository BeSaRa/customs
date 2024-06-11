import { BaseModel } from '@abstracts/base-model';
import { InterceptModel } from 'cast-response';
import { OfflinePaymentService } from '@services/offline-payment.service';
import { FineInterceptor } from '@model-interceptors/fine-interceptor';

const { send, receive } = new FineInterceptor();

@InterceptModel({ send, receive })
export class Fine extends BaseModel<Fine, OfflinePaymentService> {
  $$__service_name__$$ = 'PaymentService';
  qId!: string;
  agentName!: string;
  agencyName!: string;
  agencyNumber!: number;
  investigationFileNumber!: string;
  penaltyDecisionNumber!: string;
  penaltyDecisionDate!: string;
  penaltyAmount!: number;
  paymentDocId!: number;
  offenderId!: number;
}
