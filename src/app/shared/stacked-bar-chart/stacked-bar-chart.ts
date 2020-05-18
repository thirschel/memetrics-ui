export class StackedBarChartConfig {
   public yDomainMax: number;
   public xValueProperty: string;
   public yValueProperty: string;
   public data: Array<any>;
   public columnProperties: Array<string>;
   public tooltipFunction: any;

   constructor(yDomainMax: number,
               xValueProperty: string,
               yValueProperty: string,
               data: Array<any>,
               columnProperties: Array<string>,
               tooltipFunction) {
      this.yDomainMax = yDomainMax;
      this.xValueProperty = xValueProperty;
      this.yValueProperty = yValueProperty;
      this.data = data;
      this.columnProperties = columnProperties;
      this.tooltipFunction = tooltipFunction;
   }
}
