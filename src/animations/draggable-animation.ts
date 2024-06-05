import { animate, style, transition, trigger } from '@angular/animations';

export const DraggableAnimation = trigger('draggable', [
  transition('from => to', [
    animate(
      '500ms infinite ease-in-out',
      style({ transform: 'translate(2px,2px)' }),
    ),
    animate(
      '500ms infinite ease-in-out',
      style({ transform: 'translate(-2px,-2px)' }),
    ),
  ]),
]);
