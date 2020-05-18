import { Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { logoAnimation } from './logo-looper.transitions';

@Component({
   selector: 'logo-looper',
   templateUrl: './logo-looper.component.html',
   styleUrls: [ './logo-looper.component.scss' ],
   animations: [ logoAnimation ]
})
export class LogoLooperComponent implements OnInit {
   Math = Math;
   @Input() text: string;
   public tickCount = 0;
   public initialSize = 0;
   public shouldAnimate = true;
   public logos = [
      'uber',
      'lyft',
      'personal-capital',
      'gmail',
      'groupme',
      'linkedin'
   ];

   constructor() {
   }

   ngOnInit() {
      setTimeout(() => {
         this.initialSize = this.logos.length;
      }, 0);
      /* The animation is very fickle about jumping or jittering when the splicing or looping
       * happens so the setTimeouts are used to make sure the redraw lifecycle events occur
       */
      setTimeout(() => {
         interval(2500).subscribe(() => {
            this.logos.push(this.logos[ this.tickCount ]);
            this.tickCount = (this.tickCount + 1) % (this.initialSize + 1);
            setTimeout(() => {
               if (this.tickCount === this.initialSize && this.logos.length > this.initialSize) {
                  this.logos.splice(0, this.initialSize);
                  this.shouldAnimate = false;
                  setTimeout(() => {
                     this.tickCount = 0;
                     setTimeout(() => {
                        this.shouldAnimate = true;
                     }, 200);
                  }, 0);
               }
            }, 310);
         });
      }, 1800);

   }
}
