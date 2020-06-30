import { MultiLineChartConfig } from '../shared/multi-line-chart/multi-line-chart';
import { StackedBarChartConfig } from '../shared/stacked-bar-chart/stacked-bar-chart';
import { PeriodSelectionEnum } from '../enums/PeriodSelectionEnum';
import { Subscription } from 'rxjs/index';
import { ActivatedRoute } from '@angular/router';
import { HeatMapConfig } from '../shared/heat-map-chart/heat-map';
import { Directive } from "@angular/core";

@Directive()
export class BaseReport {

   public selectedPeriod: PeriodSelectionEnum;
   public metrics: any;
   public periodPerformanceConfig: MultiLineChartConfig;
   public weekOverWeekConfig: MultiLineChartConfig;
   public dayOfWeekConfig: StackedBarChartConfig;
   public quickStats = [];
   public heatMapData: HeatMapConfig;
   public selectedChart = 1;
   public periodPerformancePercent;
   public weekOverWeekPercent;
   public subscriptions: Array<Subscription> = [];
   public route: ActivatedRoute;

   constructor(route: ActivatedRoute){
      this.route = route;
   }

   ngOnInit() {
      this.subscriptions.push(
         this.route.params.subscribe(params => {
            const selectedPeriodId = isNaN(Number(params['period'])) ? 2 : Number(params['period']);
            this.periodChanged(selectedPeriodId);
         })
      );
   }

   getMetrics() {
   }

   createWeekOverWeekConfig(data: any[], config: MultiLineChartConfig) {
      let yDomainMax = 0;
      const weekOverWeekData = data.map((w) => {
         w.weekOfText = `Week of ${w.weekOf.toString().substring(0, 10)}`;
         w.weekOf = new Date(w[config.xValueProperty]);
         yDomainMax = yDomainMax < w[config.yValueProperty] ? w[config.yValueProperty] : yDomainMax;
         return w;
      });
      config.xDomainMax = weekOverWeekData.length;
      config.yDomainMax = yDomainMax;
      config.lines = [weekOverWeekData];
      return config;
   }

   getWeekOverWeekPercentage(config: MultiLineChartConfig) {
      const evaluatePerformance = (): number =>  config.lines[0][config.lines[0].length - 1][config.yValueProperty]
         / config.lines[0][config.lines[0].length - 2][config.yValueProperty];

      if (!isFinite(evaluatePerformance())) {
         return 0;
      }
      const performance = evaluatePerformance();
      
      return isNaN(performance) ? 0 : Number((performance * 100) - 100).toFixed(2);
   }

   getPeriodPerformancePercentage(config: MultiLineChartConfig) {
      if (config.lines.length === 1) {
         return 0;
      }
      const priorPeriodEndIndex = config.lines[0].length - 1 > config.lines[1].length ?
         config.lines[1].length - 1 :
         config.lines[0].length - 1;
      const evaluatePerformance = (): number =>  
         config.lines[0][config.lines[0].length - 1][config.yValueProperty] / config.lines[1][priorPeriodEndIndex][config.yValueProperty];

      if (!isFinite(evaluatePerformance())) {
         return 0;
      }
      const performance = evaluatePerformance();
         
      return isNaN(performance) ? 0 : Number((performance * 100) - 100).toFixed(2);
   }

   createPeriodPerformanceConfig(data: any[], config: MultiLineChartConfig, currentPeriodLabel: string = null, priorPeriodLabel: string = null) {
      let previousPerformance = data.filter(m => m.isPreviousPeriod).sort(m => m[config.xValueProperty]);
      let currentPerformance = data.filter(m => !m.isPreviousPeriod).sort(m => m[config.xValueProperty]);
      let previousMaxValue = 0;
      const lineData = [];
      currentPerformance = currentPerformance.map((p, i) => {
         p[config.yValueProperty] = i === 0 ? p[config.yValueProperty] :
            p[config.yValueProperty] + currentPerformance[i - 1][config.yValueProperty];
         p[config.xValueProperty] = `${p[config.xValueProperty]}`;
         p[config.labelProperty] = `Day ${p[config.xValueProperty]}`;
         return p;
      });
      lineData.push(currentPerformance);
      const lineNames = [`${currentPeriodLabel}`];
      if (previousPerformance.length) {
         previousPerformance = previousPerformance.map((p, i) => {
            p[config.yValueProperty] = i === 0 ? p[config.yValueProperty] :
               p[config.yValueProperty] + previousPerformance[i - 1][config.yValueProperty];
            p[config.xValueProperty] = `${p[config.xValueProperty]}`;
            p[config.labelProperty] = `Day ${p[config.xValueProperty]}`;
            return p;
         });
         previousMaxValue = previousPerformance[previousPerformance.length - 1][config.yValueProperty];
         lineData.push(previousPerformance);
         lineNames.push(`${!!priorPeriodLabel ? priorPeriodLabel : ''}`);
      }
      config.xDomainMax = Math.max(previousPerformance.length, currentPerformance.length);
      config.yDomainMax = Math.max(previousMaxValue, currentPerformance[currentPerformance.length - 1][config.yValueProperty]);
      config.lines  = lineData;
      config.lineNames = lineNames;
      return config;
   }

   createTimeOfDayConfig(data: any[], yValueProperty: string, tooltipLabel: string) {
      const blockData = [];
      [ 1, 2, 3, 4, 5, 6, 7 ].forEach(day => {
         [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ].forEach(hour => {
            blockData.push({ day, hour, value: 0 });
         });
      });
      const blocks = blockData.map(d => {
         const hourData = data.find(m => m.day === d.day && m.hour + 1 === d.hour) || { [yValueProperty]: 0 };
         d.value = hourData[yValueProperty];
         return d;
      });
      return new HeatMapConfig(blocks, tooltipLabel);
   }

   selectedChartChanged(id) {
      this.selectedChart = id;
   }

   periodChanged(id: number) {
      this.selectedPeriod = id;
      this.getMetrics();
   }

}
