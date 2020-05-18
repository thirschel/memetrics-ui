import {
   Directive,
   Output,
   Input,
   EventEmitter,
   SimpleChange,
   ChangeDetectorRef,
   OnInit,
   OnChanges
} from '@angular/core';
import { NumberType } from './number-type.enum';

@Directive({
   selector: '[numberCounter]',
})
export class NumberCounterDirective implements OnInit, OnChanges {
   @Input() value: number;
   @Input() dest: number;
   @Input() numberType = NumberType.General;
   @Input() duration = 1750;
   @Output() valueChange = new EventEmitter();
   counterDest: number;
   startTime: number;
   timestamp: number;
   isRunning = false;

   constructor(private cdr: ChangeDetectorRef) {
   }

   ngOnInit() {
      this.rafPollyfill();
   }

   ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
      if (changes[ 'dest' ]) {
         this.startAnimation();
      }
   }

   startAnimation() {
      this.isRunning = true;
      this.counterDest = this.dest;
      this.value = 0;
      delete this.startTime;
      this.valueChange.emit(this.value);
      this.cdr.detectChanges(); // http://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked/34364881
      requestAnimationFrame(this.counter.bind(this));
   }

   numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   }

   easing(t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
   }

   counter(timestamp) {
      if (!this.startTime) {
         this.startTime = timestamp;
      }
      this.timestamp = timestamp;
      const progress = timestamp - this.startTime;

      this.value = this.easing(progress, 0, this.counterDest, this.duration);
      if (this.counterDest < 0) {
         this.value = (this.value < this.counterDest) ? this.counterDest : this.counterDest % 1 === 0 ?
            Math.round(this.value) :
            Number.parseFloat(Number(`${this.value}`).toFixed(this.countDecimals(this.counterDest)));
      } else {
         this.value = (this.value > this.counterDest) ? this.counterDest : this.counterDest % 1 === 0 ?
            Math.round(this.value) :
            Number.parseFloat(Number(`${this.value}`).toFixed(this.countDecimals(this.counterDest)));
            var a= '';
      }
      this.valueChange.emit(this.getDisplayValue(this.value));


      if (progress < this.duration) {
         requestAnimationFrame(this.counter.bind(this));
      } else {
         this.isRunning = false;
      }
   }

   getDisplayValue(value) {
      if (this.numberType === NumberType.Time) {
         return this.secondsToMinutes(value);
      }
      else if (this.numberType === NumberType.Currency){
         return `$ ${this.numberWithCommas(value)}`;
      }
      else if (this.numberType === NumberType.Percent){
         return `${this.numberWithCommas(value)} %`;
      }
      return this.numberWithCommas(value);
   }

   countDecimals(value) {
      if (Math.floor(value) === value) {
         return 0;
      }
      return value.toString().split('.')[ 1 ].length || 0;
   }


   rafPollyfill() {
      // make sure requestAnimationFrame and cancelAnimationFrame are defined
      // polyfill for browsers without native support
      // by Opera engineer Erik Möller
      let lastTime = 0;
      const vendors = [ 'webkit', 'moz', 'ms', 'o' ];
      for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
         window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
         window.cancelAnimationFrame =
            window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
      }
      if (!window.requestAnimationFrame) {
         //noinspection TypeScriptValidateTypes
         window.requestAnimationFrame = function (callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(() => {
                  callback(currTime + timeToCall);
               },
               timeToCall);
            lastTime = currTime + timeToCall;
            return id;
         };
      }
      if (!window.cancelAnimationFrame) {
         window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
         };
      }

   }

   secondsToMinutes(time: number) {
      // Hours, minutes and seconds
      const hrs = ~~(time / 3600);
      const mins = ~~((time % 3600) / 60);
      const secs = ~~time % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      let ret = '';

      if (hrs > 0) {
         const hrText = `${hrs}`.length === 1 ? `0${hrs}` : hrs;
         ret += '' + hrText + ':';
      }
      else {
         ret += '00:';
      }
      const minsText = `${mins}`.length === 1 ? `0${mins}` : mins;
      const secsText = `${secs}`.length === 1 ? `0${secs}` : secs;

      ret += '' + minsText + ':';
      ret += '' + secsText;
      return ret;
   }
}
