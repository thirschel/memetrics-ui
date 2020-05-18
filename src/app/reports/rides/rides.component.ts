import { Component,  OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MultiLineChartConfig } from '../../shared/multi-line-chart/multi-line-chart';
import { QuickStat } from '../../models/quick-stat';
import { StackedBarChartConfig } from '../../shared/stacked-bar-chart/stacked-bar-chart';
import { Subscription } from 'rxjs/index';
import { ActivatedRoute } from '@angular/router';
import { pageTransition, quickStatTransition } from '../../shared/transitions';
import { PeriodSelectionEnum } from '../../enums/PeriodSelectionEnum';
import { TooltipHelper } from '../../helpers/tooltip.helper';
import { RideMetrics, RidePerformance, RidesDayOfWeek, RideWeekOverWeek } from '../../models/ride';
import { NumberType } from '../../shared/number-counter/number-type.enum';
import { BaseReport } from '../base-report.component';

@Component({
   selector: 'app-rides',
   templateUrl: './rides.component.html',
   styleUrls: ['./rides.component.scss'],
   animations: [pageTransition, quickStatTransition],
   host: {
      '[@pageTransition]': 'true',
   },
})
export class RidesComponent extends BaseReport implements OnInit {
   @ViewChild('chartData', { static: false }) chartData;

   constructor(private coreService: CoreService,
               private ngRoute: ActivatedRoute) {
      super(ngRoute);
   }

   getMetrics() {
      this.coreService.getRidesMetrics(this.selectedPeriod).subscribe((data: RideMetrics) => {
         this.metrics = data;
         if (data.ridePerformance) {
                        // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'dayNumber', 'count', [], 'dayLabel', []);
            this.periodPerformanceConfig = this.createPeriodPerformanceConfig(data.ridePerformance, config,
               data.currentPeriodLabel,
               data.priorPeriodLabel);
            this.periodPerformancePercent = this.getPeriodPerformancePercentage(this.periodPerformanceConfig);
         }
         if (data.weekOverWeek) {
                        // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'weekOf', 'total', [], 'weekOfText', ['Rides'], true);
            this.weekOverWeekConfig = this.createWeekOverWeekConfig(data.weekOverWeek, config);
            this.weekOverWeekPercent = this.getWeekOverWeekPercentage(this.weekOverWeekConfig);
         }
         if (data.ridesByDayOfWeek) {
            this.dayOfWeekConfig = this.createDayOfWeekConfig(data.ridesByDayOfWeek);
         }
         this.quickStats = this.createQuickStats(data);

                     // TODO strongly type
         this.heatMapData = this.createTimeOfDayConfig(data.ridesByHour, 'total', 'Total Rides');
      });
   }

   createQuickStats(data) {
      return [
         new QuickStat('ride', data.totalRides, 'Rides'),
         new QuickStat('avg-time-waiting', data.averageSecondsWaiting, 'Average Time Waiting (hh:mm:ss)', NumberType.Time),
         new QuickStat('avg-time-waiting', data.totalSecondsWaiting, 'Total Time Waiting (hh:mm:ss)', NumberType.Time),
         new QuickStat('avg-time-waiting', data.averageSecondsDriving, 'Average Time Driving (hh:mm:ss)', NumberType.Time),
         new QuickStat('avg-time-waiting', data.totalSecondsDriving, 'Total Time Driving (hh:mm:ss)', NumberType.Time),
         new QuickStat('avg-time-waiting', data.shortestRide, 'Shortest Ride (hh:mm:ss)', NumberType.Time),
         new QuickStat('avg-time-waiting', data.longestRide, 'Longest Ride (hh:mm:ss)', NumberType.Time),
         new QuickStat('avg-time-waiting', data.averageDistance.toFixed(2), 'Average Distance (miles)'),
         new QuickStat('avg-time-waiting', data.totalDistance.toFixed(2), 'Total Distance (miles)'),
         new QuickStat('avg-time-waiting', data.totalPrice.toFixed(2), 'Total Price', NumberType.Currency),
         new QuickStat('avg-time-waiting', data.averagePrice.toFixed(2), 'Average Price', NumberType.Currency),
         new QuickStat('avg-time-waiting', data.mostExpensivePrice.toFixed(2), 'Most Expensive Ride', NumberType.Currency),
         new QuickStat('avg-time-waiting', data.farthestDistance.toFixed(2), 'Farthest Trip (miles)'),
         new QuickStat(`week-over-week ${this.weekOverWeekPercent < 0 ? 'negative' : 'positive'}`,
            this.weekOverWeekPercent, 'Week over Week', NumberType.Percent),
         new QuickStat(`period-percent ${this.periodPerformancePercent < 0 ? 'negative' : 'positive'}`,
            this.periodPerformancePercent, 'Period Performance', NumberType.Percent),
      ];
   }

   createDayOfWeekConfig(data: RidesDayOfWeek[]) {
      const yDomainMax = Math.max(...data.map(d => d.total));
                  // TODO strongly type
      const labels = [
         {xProperty: 'dayOfWeek', yProperty: 'total', value: 'Total Rides' }
      ];
                  // TODO strongly type
      const tooltipFunction = TooltipHelper.generateStackedBarChartTooltip(labels);
      return new StackedBarChartConfig(yDomainMax, 'dayOfWeek', 'total', data, [ 'total' ], tooltipFunction);
   }
}
