export class HeatMapConfig {
   public blocks: Array<any>;
   public tooltipLabel: string;

   constructor(blocks: Array<any>,
               tooltipLabel: string) {
      this.blocks = blocks;
      this.tooltipLabel = tooltipLabel;
   }
}
