import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { Ease } from '../../../shared/ease';
export const animoconsTransition = trigger('animoconsTransition', [
   state('*', style({ opacity: 1 })),

   transition('* => void', [
      sequence([
         animate('30.8s ' + Ease.outCubic, style({ background: 'red'})),
         animate('.8s ' + Ease.outCubic, style({ transform: 'scale(0)'})),
      ]),
   ]),
]);
