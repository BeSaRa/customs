import { ModelInterceptorContract } from 'cast-response';
import { GuidePanel } from '@models/guide-panel';

export class GuidePanelInterceptor
  implements ModelInterceptorContract<GuidePanel>
{
  send(model: Partial<GuidePanel>): Partial<GuidePanel> {
    return model;
  }

  receive(model: GuidePanel): GuidePanel {
    return model;
  }
}
