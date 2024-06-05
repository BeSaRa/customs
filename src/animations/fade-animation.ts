import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const FadeAnimation = trigger('fade', [
  state('*', style({ opacity: '*' })),
  state('void', style({ opacity: 0 })),
  transition('* => void', animate('1000ms ease-in-out')),
]);
