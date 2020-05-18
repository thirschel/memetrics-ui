import { animate, state, style, transition, trigger } from '@angular/animations';
import { Ease } from '../ease';

export const dropdownAnimations = trigger('dropdownAnimations', [
   state('true', style({ opacity: 1, height: '*', display: 'block', marginTop: '0' })),
   state('false', style({ opacity: 0, height: 0, display: 'none', marginTop: '-20px' })),
   transition('false => true', [
      style({ display: 'block', marginTop: '-20px' }),
      animate('.3s ' + Ease.inOutCubic, style({ marginTop: '0', opacity: 1, height: '*' })),
   ]),
   transition('true => false', [
      animate('.3s ' + Ease.inOutCubic),
   ]),
]);
