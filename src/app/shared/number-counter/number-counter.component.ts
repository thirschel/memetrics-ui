import { Component, Input, SimpleChange, OnChanges } from '@angular/core';
import { NumberType } from './number-type.enum';


@Component({
   selector: 'number-counter',
   templateUrl: './number-counter.component.html',
   styleUrls: [ './number-counter.component.scss' ],
})
export class NumberCounterComponent implements OnChanges {
   @Input() value: number;
   @Input() numberType: NumberType = NumberType.General;
   @Input() isTime = false;
   public dest: number;

   ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
      this.dest = changes[ 'value' ].currentValue ? changes[ 'value' ].currentValue : 0;
   }
}
