import { ModelInterceptorContract } from 'cast-response';
import { Investigation } from '@models/investigation';

export class InvestigationInterceptor implements ModelInterceptorContract<Investigation> {
  send(model: Partial<Investigation>): Partial<Investigation> {
    delete model.$$__service_name__$$;
    console.log('send')
    return model;
  }

  receive(model: Investigation): Investigation {
    console.log('receive')
    return model;
  }
}
