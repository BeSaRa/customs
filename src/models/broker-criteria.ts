import { Broker } from '@models/broker';

export class BrokerCriteria extends Broker {
  override buildForm(controls = false): object {
    const { arName, enName, qid, companyId, code, licenseNumber } = this;
    return {
      arName: controls ? [arName] : arName,
      enName: controls ? [enName] : enName,
      qid: controls ? [qid] : qid,
      companyId: controls ? [companyId] : companyId,
      code: controls ? [code] : code,
      licenseNumber: controls ? [licenseNumber] : licenseNumber,
    };
  }
}
