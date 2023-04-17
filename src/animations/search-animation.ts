import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const SearchAnimation = trigger('scaleInOut', [
  state(
    'true',
    style({
      transform: 'scale(1)',
      opacity: 1,
    })
  ),
  state(
    'false',
    style({
      transform: 'scale(0)',
      opacity: 0,
    })
  ),
  transition('true <=> false', animate('150ms ease-in-out')),
]);
