import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MultiLineChartConfig } from '../../shared/multi-line-chart/multi-line-chart';
import { QuickStat } from '../../models/quick-stat';
import { StackedBarChartConfig } from '../../shared/stacked-bar-chart/stacked-bar-chart';
import { ActivatedRoute } from '@angular/router';
import { pageTransition, quickStatTransition } from '../../shared/transitions';
import { TooltipHelper } from '../../helpers/tooltip.helper';
import { CallMetrics,  CallsDayOfWeek } from '../../models/call';
import { NumberType } from '../../shared/number-counter/number-type.enum';
import { BaseReport } from '../base-report.component';

@Component({
   selector: 'app-calls',
   templateUrl: './calls.component.html',
   styleUrls: [ './calls.component.scss' ],
   animations: [ pageTransition, quickStatTransition ],
   host: {
      '[@pageTransition]': 'true',
   },
})
export class CallsComponent extends BaseReport implements OnInit  {
   @ViewChild('chartData', { static: false }) chartData;

   constructor(private coreService: CoreService,
               private ngRoute: ActivatedRoute) {
      super(ngRoute);
   }

   getMetrics() {
      this.coreService.getCallsMetrics(this.selectedPeriod).subscribe((data: CallMetrics) => {
         this.metrics = data;
         if (data.callPerformance) {
            // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'dayNumber', 'count', [], 'dayLabel', []);
            this.periodPerformanceConfig = this.createPeriodPerformanceConfig(data.callPerformance, config,
               data.currentPeriodLabel,
               data.priorPeriodLabel);
            this.periodPerformancePercent = this.getPeriodPerformancePercentage(this.periodPerformanceConfig);
         }
         if (data.weekOverWeek) {
            // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'weekOf', 'total', [], 'weekOfText', [ 'Calls' ], true);
            this.weekOverWeekConfig = this.createWeekOverWeekConfig(data.weekOverWeek, config);
            this.weekOverWeekPercent = this.getWeekOverWeekPercentage(this.weekOverWeekConfig);
         }
         if (data.callsByDayOfWeek) {
            this.dayOfWeekConfig = this.createDayOfWeekConfig(data.callsByDayOfWeek);
         }
         this.quickStats = this.createQuickStats(data);
// TODO strongly type
         this.heatMapData = this.createTimeOfDayConfig(data.callsByHour, 'total', 'Total Calls');
      });
   }

   createQuickStats(data) {
      return [
         new QuickStat('calls', data.totalCalls || 0, 'Calls'),
         new QuickStat('incoming', data.totalCallsIncoming || 0, 'Incoming Calls'),
         new QuickStat('outgoing', data.totalCallsOutgoing || 0, 'Outgoing Calls'),
         new QuickStat('duration', data.totalDurationSeconds || 0, 'Total Call Duration (hh:mm:ss)', NumberType.Time),
         new QuickStat('duration', data.totalKnownDurationSeconds || 0, 'Total Call Duration Known Contacts (hh:mm:ss)', NumberType.Time),
         new QuickStat('duration', data.totalKnownFemaleDurationSeconds || 0, 'Total Call Duration Known Female Contacts (hh:mm:ss)', NumberType.Time),
         new QuickStat('duration', data.totalKnownMaleDurationSeconds || 0, 'Total Call Duration Known Male Contacts (hh:mm:ss)', NumberType.Time),
         new QuickStat(`week-over-week ${this.weekOverWeekPercent < 0 ? 'negative' : 'positive'}`,
            this.weekOverWeekPercent  || 0, 'Week over Week', NumberType.Percent),
         new QuickStat(`period-percent ${this.periodPerformancePercent < 0 ? 'negative' : 'positive'}`,
            this.periodPerformancePercent  || 0, 'Period Performance', NumberType.Percent),
      ];
   }

   createDayOfWeekConfig(data: CallsDayOfWeek[]) {
      const yDomainMax = Math.max(...data.map(d => d.total));
      // TODO strongly type
      const labels = [
         { xProperty: 'dayOfWeek', yProperty: 'incoming', value: 'Incoming' },
         { xProperty: 'dayOfWeek', yProperty: 'outgoing', value: 'Outgoing' }
      ];
      // TODO strongly type
      const tooltipFunction = TooltipHelper.generateStackedBarChartTooltip(labels); 
      return new StackedBarChartConfig(yDomainMax, 'dayOfWeek', 'total', data, [ 'incoming', 'outgoing' ], tooltipFunction);
   }
}
