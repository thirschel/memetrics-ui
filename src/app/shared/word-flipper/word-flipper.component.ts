import { Component, Input, SimpleChange, OnChanges, ElementRef } from '@angular/core';
import { wordFlipperTransition } from './word-flipper.transitions';

@Component({
   selector: 'word-flipper',
   templateUrl: './word-flipper.component.html',
   styleUrls: [ './word-flipper.component.scss' ],
   animations: [ wordFlipperTransition ]
})
export class WordFlipperComponent implements OnChanges {

   @Input() word = '';

   public fromLetters: string[];
   public toLetters: string[];
   public words = [];
   public state = 'off';

   constructor(private elRef: ElementRef) {
   }

   ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
      this.state = 'off';
      const previousValue = changes[ 'word' ].previousValue ? changes[ 'word' ].previousValue : '';
      this.fromLetters = previousValue.split('');
      this.toLetters = changes[ 'word' ].currentValue.split('');
      setTimeout(() => {
         this.state = 'on';
      }, 0);
   }
}
