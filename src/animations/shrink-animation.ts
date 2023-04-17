import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const ShrinkAnimation = trigger('shrink', [
  state('true', style({ height: 0, width: 0, opacity: 0 })),
  state('false', style({ height: '*', width: '*', opacity: 1 })),
  transition('true <=> false', animate('150ms ease-in-out')),
]);
