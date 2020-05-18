import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import * as mojs from '../../../shared/mo-js/mo-js.min';
import { animoconsTransition } from './animocons.transitions';

@Component({
   selector: 'app-animocons',
   templateUrl: './animocons.component.html',
   styleUrls: [ './animocons.component.scss' ],
   animations: [animoconsTransition]
})
export class AnimoconsComponent implements OnInit, AfterViewInit {
   @ViewChild('creditCard', { static: true }) creditCard;
   @ViewChild('message', { static: true }) message;
   @ViewChild('phone', { static: true }) phone;
   @HostBinding('@animoconsTransition')
   public primaryColor = '#8a85b0';
   public accentColor = '#fdb762';

   public timelines = {
      phone: null,
      message: null,
      creditCard: null
   };
   constructor() {
   }

   ngOnInit() {
   }

   ngAfterViewInit() {
      this.timelines.phone = this.createPhoneTimeline();
      this.timelines.message = this.createMessageTimeline();
      this.timelines.creditCard = this.createCreditCardTimeline();
      setTimeout(() => {
         this.timelines.phone.replay();
      }, 2200);
      setTimeout(() => {
         this.timelines.message.replay();
      }, 1200);
      setTimeout(() => {
         this.timelines.creditCard.replay();
      }, 1700);
   }

   onIconHover(timeline) {
      if (timeline){
         timeline.replay();
      }
   }

   createPhoneTimeline() {
      const timeline = new mojs.Timeline();
      const svg = this.phone.nativeElement.querySelector('svg');
      const scaleCurve8 = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
      const tweens = [
         // burst animation
         new mojs.Burst({
            parent: this.phone.nativeElement,
            count: 28,
            radius: { 50: 110 },
            children: {
               fill: this.primaryColor,
               opacity: 0.6,
               radius: { 'rand(5,20)': 0 },
               scale: 1,
               swirlSize: 15,
               duration: 1600,
               easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
               isSwirl: true
            }
         }),
         // burst animation
         new mojs.Burst({
            parent: this.phone.nativeElement,
            count: 18,
            angle: { 0: 10 },
            radius: { 140: 200 },
            children: {
               fill: this.primaryColor,
               shape: 'line',
               opacity: 0.6,
               radius: { 'rand(5,20)': 0 },
               scale: 1,
               stroke: this.accentColor,
               strokeWidth: 2,
               duration: 1800,
               delay: 300,
               easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
            }
         }),
         // burst animation
         new mojs.Burst({
            parent: this.phone.nativeElement,
            radius: { 40: 80 },
            count: 18,
            children: {
               fill: this.accentColor,
               opacity: 0.6,
               radius: { 'rand(5,20)': 0 },
               scale: 1,
               swirlSize: 15,
               duration: 2000,
               delay: 500,
               easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
               isSwirl: true
            }
         }),
         // burst animation
         new mojs.Burst({
            parent: this.phone.nativeElement,
            count: 20,
            angle: { 0: -10 },
            radius: { 90: 130 },
            children: {
               fill: this.primaryColor,
               opacity: 0.6,
               radius: { 'rand(10,20)': 0 },
               scale: 1,
               duration: 3000,
               delay: 750,
               easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
            }
         }),
         // icon scale animation
         new mojs.Tween({
            duration: 400,
            easing: mojs.easing.back.out,
            onUpdate: function (progress) {
               const scaleProgress = scaleCurve8(progress);
               svg.style.WebkitTransform = svg.style.transform = 'scale3d(' + progress + ',' + progress + ',1)';
            }
         })
      ];
      tweens.forEach(t => timeline.add(t));
      return timeline;
   }

   createMessageTimeline() {
      const timeline = new mojs.Timeline();
      const svg = this.message.nativeElement.querySelector('svg');
      const tweens = [
// burst animation
         new mojs.Burst({
            parent: this.message.nativeElement,
            radius: { 30: 90 },
            count: 6,
            children: {
               fill: this.accentColor,
               opacity: 0.6,
               radius: 15,
               duration: 1700,
               easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
            }
         }),
         // ring animation
         new mojs.Shape({
            parent: this.message.nativeElement,
            type: 'circle',
            radius: { 0: 60 },
            fill: 'transparent',
            stroke: this.primaryColor,
            strokeWidth: { 20: 0 },
            opacity: 0.6,
            duration: 700,
            easing: mojs.easing.sin.out
         }),
         // icon scale animation
         new mojs.Tween({
            duration: 1200,
            onUpdate: function (progress) {
               if (progress > 0.3) {
                  const elasticOutProgress = mojs.easing.elastic.out(1.43 * progress - 0.43);
                  svg.style.WebkitTransform = svg.style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
               }
               else {
                  svg.style.WebkitTransform = svg.style.transform = 'scale3d(0,0,1)';
               }
            }
         })
      ];
      tweens.forEach(t => timeline.add(t));
      return timeline;
   }

   createCreditCardTimeline() {
      const timeline = new mojs.Timeline();
      const svg = this.creditCard.nativeElement.querySelector('svg');
      const tweens = [
         new mojs.Burst({
            parent: this.creditCard.nativeElement,
            radius: { 90: 150 },
            count: 18,
            children: {
               fill: this.primaryColor,
               opacity: 0.6,
               scale: 1,
               radius: { 'rand(5,20)': 0 },
               swirlSize: 15,
               direction: [ 1, 1, -1, -1, 1, 1, -1, -1, -1 ],
               duration: 1200,
               delay: 200,
               easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
               isSwirl: true

            }
         }),
         // ring animation
         new mojs.Shape({
            parent: this.creditCard.nativeElement,
            radius: { 30: 100 },
            fill: 'transparent',
            stroke: this.accentColor,
            strokeWidth: { 30: 0 },
            opacity: 0.6,
            duration: 1500,
            easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
         }),
         new mojs.Shape({
            parent: this.creditCard.nativeElement,
            radius: { 30: 80 },
            fill: 'transparent',
            stroke: this.primaryColor,
            strokeWidth: { 20: 0 },
            opacity: 0.3,
            duration: 1600,
            delay: 320,
            easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
         }),
         // icon scale animation
         new mojs.Tween({
            duration: 1000,
            onUpdate: function (progress) {
               if (progress > 0.3) {
                  const elasticOutProgress = mojs.easing.elastic.out(1.43 * progress - 0.43);
                  svg.style.WebkitTransform = svg.style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
               }
               else {
                  svg.style.WebkitTransform = svg.style.transform = 'scale3d(0,0,1)';
               }
            }
         })
      ];
      tweens.forEach(t => timeline.add(t));
      return timeline;
   }

}
