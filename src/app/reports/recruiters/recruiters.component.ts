import { Component, OnInit, ViewChild } from '@angular/core';
import { MultiLineChartConfig } from '../../shared/multi-line-chart/multi-line-chart';
import { StackedBarChartConfig } from '../../shared/stacked-bar-chart/stacked-bar-chart';
import { TooltipHelper } from '../../helpers/tooltip.helper';
import { QuickStat } from '../../models/quick-stat';
import { Subscription } from 'rxjs/index';
import { CoreService } from '../../services/core.service';
import { ActivatedRoute } from '@angular/router';
import { pageTransition, quickStatTransition } from '../../shared/transitions';
import { PeriodSelectionEnum } from '../../enums/PeriodSelectionEnum';
import {
   RecruiterDayOfWeek, RecruiterMetrics, RecruiterPerformance,
   RecruiterWeekOverWeek
} from '../../models/recruiter-message';
import { NumberType } from '../../shared/number-counter/number-type.enum';
import { BaseReport } from '../base-report.component';

@Component({
   selector: 'app-recruiters',
   templateUrl: './recruiters.component.html',
   styleUrls: [ './recruiters.component.scss' ],
   animations: [pageTransition, quickStatTransition],
   host: {
      '[@pageTransition]': 'true',
   },
})
export class RecruitersComponent extends BaseReport implements OnInit {
   @ViewChild('chartData', { static: false }) chartData;

   constructor(private coreService: CoreService,
               private ngRoute: ActivatedRoute) {
      super(ngRoute);
   }

   getMetrics() {
      this.coreService.getRecruitersMetrics(this.selectedPeriod).subscribe((data: RecruiterMetrics) => {
         this.metrics = data;
         if (data.messagePerformance) {
            // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'dayNumber', 'count', [], 'dayLabel', []);
            this.periodPerformanceConfig = this.createPeriodPerformanceConfig(data.messagePerformance, config,
               data.currentPeriodLabel,
               data.priorPeriodLabel);
            this.periodPerformancePercent = this.getPeriodPerformancePercentage(this.periodPerformanceConfig);
         }
         if (data.weekOverWeek) {
            // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'weekOf', 'total', [], 'weekOfText', ['Messages'], true);
            this.weekOverWeekConfig = this.createWeekOverWeekConfig(data.weekOverWeek, config);
            this.weekOverWeekPercent = this.getWeekOverWeekPercentage(this.weekOverWeekConfig);
         }
         if (data.messagesByDayOfWeek) {
            this.dayOfWeekConfig = this.createDayOfWeekConfig(data.messagesByDayOfWeek);
         }
         this.quickStats = this.createQuickStats(data);
      });
   }

   createQuickStats(data) {
      return [
         new QuickStat('messages', data.totalMessages || 0, 'Messages'),
         new QuickStat(`week-over-week ${this.weekOverWeekPercent < 0 ? 'negative' : 'positive'}`,
            this.weekOverWeekPercent || 0, 'Week over Week', NumberType.Percent),
         new QuickStat(`period-percent ${this.periodPerformancePercent < 0 ? 'negative' : 'positive'}`,
            this.periodPerformancePercent || 0, 'Period Performance', NumberType.Percent),
         new QuickStat('unqiue-contacts', data.uniqueContacts || 0, 'Unique Contacts'),
      ];
   }



   createDayOfWeekConfig(data: RecruiterDayOfWeek[]) {
      const yDomainMax = Math.max(...data.map(d => d.total));
                  // TODO strongly type
      const labels = [
         { xProperty: 'dayOfWeek', yProperty: 'incoming', value: 'Incoming' },
         { xProperty: 'dayOfWeek', yProperty: 'outgoing', value: 'Outgoing' }
      ];
                  // TODO strongly type
      const tooltipFunction = TooltipHelper.generateStackedBarChartTooltip(labels);
      return new StackedBarChartConfig(yDomainMax, 'dayOfWeek', 'total', data, ['incoming', 'outgoing' ], tooltipFunction);
   }
}
