export class MultiLineChartConfig {
   public xDomainMax: number;
   public yDomainMax: number;
   public xValueProperty: string;
   public yValueProperty: string;
   public lines: Array<any>;
   public labelProperty: string;
   public lineNames: Array<string>;
   public xAxisIsTime: boolean;

   constructor(xDomainMax: number,
               yDomainMax: number,
               xValueProperty: string,
               yValueProperty: string,
               lines: Array<any>,
               labelProperty: string,
               lineNames: Array<string>,
               xAxisIsTime: boolean = false) {
      this.xDomainMax = xDomainMax;
      this.yDomainMax = yDomainMax;
      this.xValueProperty = xValueProperty;
      this.yValueProperty = yValueProperty;
      this.lines = lines;
      this.labelProperty = labelProperty;
      this.lineNames = lineNames;
      this.xAxisIsTime = xAxisIsTime;
   }
}
