import { animate, query, stagger, style, group, transition, trigger } from '@angular/animations';

export const wordFlipperTransition = trigger('wordFlipperTransition', [
   transition('off => on', [
      query('.to', style({ opacity: '0' })),
      query('.to-letter', style({ transform: 'rotateX(-90deg)' })),
      group([
         query('.from-letter',  [
            style({ transform: 'translateZ(25px)' }),
            stagger(75, [
               animate('0.26s cubic-bezier(0.55, 0.055, 0.675, 0.19)', style({ transform: 'rotateX(90deg)' }))
            ])
         ], { optional: true }),
         query('.to', style({ opacity: 1 })),
         query('.to-letter', [
            style({ transform: 'rotateX(-90deg)' }),
            stagger(75, [
               animate('0.3s 340ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'rotateX(0deg)' }))
            ])
         ]),
      ])
   ]),
]);
