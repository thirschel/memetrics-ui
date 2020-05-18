import { animate, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { Ease } from '../../../shared/ease';
export const logoAnimation = trigger('logoAnimation', [
   state('*', style({ opacity: 1 })),

   transition('void => *', [
      sequence([
         query('.logo-wrapper', style({ opacity: '0' })),
         animate('1.4s ' + Ease.outCubic, style({ background: 'transparent' })),
         query('.logo-wrapper', [
            stagger(75, [
               animate('.3s ' + Ease.outCubic, style({ opacity: '1' })),
            ])
         ]),
      ])
   ]),
]);
