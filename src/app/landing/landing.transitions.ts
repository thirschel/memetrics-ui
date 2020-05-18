import { animate, group, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { Ease } from '../shared/ease';

export const landingTransition = trigger('landingTransition', [
   transition('* => destroy', [
      style({ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
      group([
         query('.landing-text', animate('.3s ' + Ease.outCubic, style({ opacity: 0}))),
         query('.about', animate('.3s ' + Ease.outCubic, style({ opacity: 0}))),
      ]),
      sequence([
         query('app-particle-background', style({ opacity: '0' })),
         animate('.6s ' + Ease.outCubic, style({ height: '5px'})),
         animate('.5s ' + Ease.outCubic, style({ top: '-5px '})),
         query('.banner-overlay', style({ zIndex: 100 })),
         animate('.5s ' + Ease.outCubic, style({ height: '330px'})),
         animate('10s ' + Ease.outCubic, style({ opacity: 1})),
      ]),
   ]),
]);
export const splashTransition = trigger('splashTransition', [
   state('*', style({ transform: 'translateY(-100%)', zIndex: 1 })),
   state('main', style({ transform: 'translateY(0)', zIndex: 10})),

   transition('what => main', [
      style({ transform: 'translateY(-100%)' }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(-100%)' })), // Used as a delay
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(0)' })),
      ]),
   ]),
   transition('data => main', [
      style({ transform: 'translateY(-100%)' }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(-100%)' })), // Used as a delay
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(0)' })),
      ]),
   ]),
   transition('how => main', [
      style({ transform: 'translateY(100%)' }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(100%)' })), // Used as a delay
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(0)' })),
      ]),
   ]),
   transition('main => what', [
      style({ transform: 'translateY(0)' }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(-100%)' })),
      ]),
   ]),
   transition('main => data', [
      style({ transform: 'translateY(0)' }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(-100%)' })),
      ]),
   ]),
   transition('main => how', [
      style({ transform: 'translateY(0)' }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ transform: 'translateY(100%)' })),
      ]),
   ]),
]);

export const mainLandingTransition = trigger('mainLandingTransition', [
   state('*', style({ opacity: 0, zIndex: 1 })),
   state('main', style({ opacity: 1, zIndex: 10})),

   transition('* => main', [
      style({ opacity: 0 }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ opacity: '0'})),
         animate('.8s ' + Ease.outCubic, style({ opacity: '1'})),
      ]),
   ]),
   transition('main => *', [
      style({ opacity: 1 }),
      sequence([
         animate('.8s ' + Ease.outCubic, style({ opacity: '0'})),
      ]),
   ]),
]);


export const whatTransition = trigger('whatTransition', [
   state('*', style({ opacity: 0, zIndex: 1 })),
   state('what', style({ opacity: 1, zIndex: 10})),

   transition('* => what', [
      style({ opacity: 0 }),
      sequence([
         query('.transition-bar', style({ width: 0, transform: 'translateX(0)'  })),
         query('h1', style({ opacity: 0, transform: 'translateX(-115px)'  })),
         query('.sub-text', style({ opacity: 0, transform: 'translateX(-115px)'  })),
         animate('.8s ' + Ease.outCubic, style({ opacity: '0'})), // Used as a delay
         animate('.8s ' + Ease.outCubic, style({ opacity: '1'})),
         group([
            query('.transition-bar', [
               sequence([
                  animate('.4s ' + Ease.outCubic, style({ width: '*', transform: 'translateX(0)'})),
                  animate('.25s ' + Ease.inOutCubic, style({ width: '*', transform: 'translateX(100%)'})),
               ]),
            ]),
            query('h1', [
               sequence([
                  animate('.3s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(-115px)' })),
                  animate('.5s ' + Ease.inOutCubic, style({ opacity: 1, transform: 'translateX(0)' })),
               ]),
            ]),
            query('.sub-text', [
               sequence([
                  animate('.3s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(-115px)' })),
                  animate('.6s ' + Ease.inOutCubic, style({ opacity: 1, transform: 'translateX(0)' })),
               ]),
            ])
         ]),

      ]),
   ]),
   transition('what => *', [
      style({ opacity: 1 }),
      sequence([
         sequence([
            group([
               query('.transition-bar', [
                  sequence([
                     animate('.4s ' + Ease.outCubic, style({ width: '*', transform: 'translateX(0)'})),
                     animate('.25s ' + Ease.inOutCubic, style({ width: '*', transform: 'translateX(100%)'})),
                  ]),
               ]),
               query('h1', [
                  sequence([
                     animate('.3s ' + Ease.outCubic, style({ opacity: 1, transform: 'translateX(0)' })),
                     animate('.1s ' + Ease.inOutCubic, style({ opacity: 0, transform: 'translateX(0)' })),
                  ]),
               ]),
               query('.sub-text', [
                  sequence([
                     animate('.65s ' + Ease.inOutCubic, style({ opacity: 0, transform: 'translateX(115px)' })),
                  ]),
               ]),
            ]),
         ]),
      ]),
   ]),
]);

export const dataTransition = trigger('dataTransition', [
   state('*', style({ opacity: 0, zIndex: 1 })),
   state('data', style({ opacity: 1, zIndex: 10})),

   transition('* => data', [
      style({ opacity: 0 }),
      sequence([
         query('.transition-bar', style({ width: '*', transform: 'translateX(100%)'  })),
         query('h1', style({ opacity: 0, transform: 'translateX(115px)'  })),
         query('.sub-text', style({ opacity: 0, transform: 'translateX(115px)'  })),
         animate('.8s ' + Ease.outCubic, style({ opacity: '0'})), // Used as a delay
         animate('.8s ' + Ease.outCubic, style({ opacity: '1'})),
         group([
            query('.transition-bar', [
               sequence([
                  animate('.4s ' + Ease.outCubic, style({ width: '*', transform: 'translateX(0)'})),
                  animate('.25s ' + Ease.inOutCubic, style({ width: 0, transform: 'translateX(0)'})),
               ]),
            ]),
            query('h1', [
               sequence([
                  animate('.3s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(115px)' })),
                  animate('.5s ' + Ease.inOutCubic, style({ opacity: 1, transform: 'translateX(0)' })),
               ]),
            ]),
            query('.sub-text', [
               sequence([
                  animate('.3s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(115px)' })),
                  animate('.6s ' + Ease.inOutCubic, style({ opacity: 1, transform: 'translateX(0)' })),
               ]),
            ])
         ]),
      ]),
   ]),
   transition('data => *', [
      style({ opacity: 1 }),
      sequence([
         sequence([
            group([
               query('.transition-bar', [
                  sequence([
                     animate('.4s ' + Ease.outCubic, style({ width: '*', transform: 'translateX(0)'})),
                     animate('.25s ' + Ease.inOutCubic, style({ width: 0, transform: 'translateX(0)'})),
                  ]),
               ]),
               query('h1', [
                  sequence([
                     animate('.3s ' + Ease.outCubic, style({ opacity: 1, transform: 'translateX(0)' })),
                     animate('.1s ' + Ease.inOutCubic, style({ opacity: 0, transform: 'translateX(0)' })),
                  ]),
               ]),
               query('.sub-text', [
                  sequence([
                     animate('.65s ' + Ease.inOutCubic, style({ opacity: 0, transform: 'translateX(-115px)' })),
                  ]),
               ]),
            ]),
         ]),
      ]),
   ]),
]);

export const howTransition = trigger('howTransition', [
   state('*', style({ opacity: 0, zIndex: 1 })),
   state('how', style({ opacity: 1, zIndex: 10})),

   transition('* => how', [
      style({ opacity: 0 }),
      sequence([
         query('.transition-bar', style({ width: 0, transform: 'translateX(0)'  })),
         query('h1', style({ opacity: 0, transform: 'translateX(-115px)'  })),
         query('.sub-text', style({ opacity: 0, transform: 'translateX(-115px)'  })),
         animate('.8s ' + Ease.outCubic, style({ opacity: '0'})), // Used as a delay
         animate('.8s ' + Ease.outCubic, style({ opacity: '1'})),
         group([
            query('.transition-bar', [
               sequence([
                  animate('.4s ' + Ease.outCubic, style({ width: '*', transform: 'translateX(0)'})),
                  animate('.25s ' + Ease.inOutCubic, style({ width: '*', transform: 'translateX(100%)'})),
               ]),
            ]),
            query('h1', [
               sequence([
                  animate('.3s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(-115px)' })),
                  animate('.5s ' + Ease.inOutCubic, style({ opacity: 1, transform: 'translateX(0)' })),
               ]),
            ]),
            query('.sub-text', [
               sequence([
                  stagger(75, [
                     animate('.3s ' + Ease.outCubic, style({ opacity: 0, transform: 'translateX(-115px)' })),
                     animate('.6s ' + Ease.inOutCubic, style({ opacity: 1, transform: 'translateX(0)' })),
                  ]),
               ]),
            ])
         ]),

      ]),
   ]),
   transition('how => *', [
      style({ opacity: 1 }),
      sequence([
         sequence([
            group([
               query('.transition-bar', [
                  sequence([
                     animate('.4s ' + Ease.outCubic, style({ width: '*', transform: 'translateX(0)'})),
                     animate('.25s ' + Ease.inOutCubic, style({ width: '*', transform: 'translateX(100%)'})),
                  ]),
               ]),
               query('h1', [
                  sequence([
                     animate('.3s ' + Ease.outCubic, style({ opacity: 1, transform: 'translateX(0)' })),
                     animate('.1s ' + Ease.inOutCubic, style({ opacity: 0, transform: 'translateX(0)' })),
                  ]),
               ]),
               query('.sub-text', [
                  sequence([
                     stagger(75, [
                        animate('.65s ' + Ease.inOutCubic, style({ opacity: 0, transform: 'translateX(115px)' })),
                     ])
                  ]),
               ]),
            ]),
         ]),
      ]),
   ]),
]);
