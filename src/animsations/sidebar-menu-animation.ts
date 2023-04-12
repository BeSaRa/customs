import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const SidebarMenuAnimation = trigger('openClose', [
  state(
    'closed',
    style({
      height: 0,
      opacity: 0,
    })
  ),
  state(
    'opened',
    style({
      height: '*',
      opacity: 1,
    })
  ),
  state(
    'search',
    style({
      height: '*',
      opacity: 1,
    })
  ),
  transition('opened <=> closed', animate('150ms ease-in-out')),
]);
