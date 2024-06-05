import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const GrowAnimation = trigger('grow', [
  state('void', style({ height: 0, width: 0, opacity: 0 })),
  state('*', style({ height: '*', width: '*', opacity: '*' })),
  transition('void => *', animate('200ms ease-in-out')),
]);
