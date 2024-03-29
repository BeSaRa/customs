import { GeneralInterceptorContract } from 'cast-response';

export class GeneralInterceptor implements GeneralInterceptorContract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(model: Partial<any>): Partial<any> {
    delete model['$$__employeeService__$$'];
    delete model['$$__service_name__$$'];
    delete model['$$__lookupService__$$'];
    return model;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receive(model: any) {
    model.setItemRoute && model.setItemRoute();
    return model;
  }
}
