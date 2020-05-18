import { NumberType } from '../shared/number-counter/number-type.enum';
export class QuickStat {
   public statClass: string;
   public value: number | string;
   public label: string;
   public numberType: NumberType;

   constructor(statClass: string, value: number | string, label: string, numberType: NumberType = NumberType.General) {
      this.statClass = statClass;
      this.value = value;
      this.label = label;
      this.numberType = numberType;
   }
}
