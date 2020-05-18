import { animate, group, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { Ease } from './ease';

export const pageTransition = trigger('pageTransition', [
   state('*', style({ opacity: 1 })),
   transition('void => *', [
      style({ opacity: 0, transform: 'translateX(75px)' }),
      animate('.7s .6s ' + Ease.outCubic),
   ]),
   transition('* => void', [
      animate('.6s ' + Ease.outCubic, style({
         transform: 'translateX(-75px)', opacity: 0,
      })),
   ]),
]);

export const quickStatTransition = trigger('quickStatTransition', [
   state('*', style({ height: '*' })),
   transition('void => *', [
      query('.stat', style({ opacity: 0 })),
      style({ height: 0 }),
      group([
         animate('1s ' + Ease.outCubic, style({ height: '*' })),
         query('.stat', [
            style({ opacity: 0, transform: 'translateY(-40px)' }),
            stagger(75, [
               animate('.3s ' + Ease.outCubic, style({ opacity: 1, transform: 'none' }))
            ])
         ]),
      ])
   ]),
   transition('* => void', [
      style({ width: '*' }),
      query('.stat', [
         style({ opacity: 1, transform: 'none' }),
         stagger(-100, [
            animate('.2s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateY(-40px)' }))
         ])
      ]),
      animate('.3s ' + Ease.outCubic, style({ width: 0 })),
   ]),
]);


export const reportTransition = trigger('reportTransition', [
   state('*', style({ height: 60 })),
   transition('void => *', [
      query('.report', style({ opacity: 0 })),
      style({ height: 0 }),
      group([
         animate('.3s ' + Ease.outCubic, style({ height: 60 })),
         query('.report', [
            style({ opacity: 0, transform: 'translateX(-40px)' }),
            stagger(200, [
               animate('.3s ' + Ease.outCubic, style({ opacity: 1, transform: 'none' }))
            ])
         ]),
      ])
   ]),
   transition('* => void', [
      style({ height: 60 }),
      query('.report', [
         style({ opacity: 1, transform: 'none' }),
         stagger(-100, [
            animate('.2s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(-40px)' }))
         ])
      ]),
      animate('.3s ' + Ease.outCubic, style({ height: 0 })),
   ]),
]);
