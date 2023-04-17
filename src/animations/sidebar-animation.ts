import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const SidebarAnimation = trigger('sidebar', [
  state(
    'opened',
    style({
      width: '*',
    })
  ),
  state(
    'closed',
    style({
      width: '75px',
    })
  ),
  transition('* <=> opened', [animate('150ms ease-in-out')]),
]);
