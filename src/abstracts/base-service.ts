import { BaseServiceContract } from '@contracts/base-service-contract';
import { ServiceRegistry } from '@services/service-registry';

export abstract class BaseService implements BaseServiceContract {
  abstract serviceName: string;

  protected constructor() {
    ServiceRegistry.set(this.getServiceName(), this);
  }

  getServiceName(): string {
    return this.serviceName;
  }
}
