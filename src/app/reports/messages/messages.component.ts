import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MultiLineChartConfig } from '../../shared/multi-line-chart/multi-line-chart';
import { QuickStat } from '../../models/quick-stat';
import { StackedBarChartConfig } from '../../shared/stacked-bar-chart/stacked-bar-chart';
import { ActivatedRoute } from '@angular/router';
import { pageTransition, quickStatTransition } from '../../shared/transitions';
import { TooltipHelper } from '../../helpers/tooltip.helper';
import { MessageMetrics,  MessagesDayOfWeek } from '../../models/message';
import { NumberType } from '../../shared/number-counter/number-type.enum';
import { BaseReport } from '../base-report.component';

@Component({
   selector: 'app-messages',
   templateUrl: './messages.component.html',
   styleUrls: [ './messages.component.scss' ],
   animations: [pageTransition, quickStatTransition],
   host: {
      '[@pageTransition]': 'true',
   },
})
export class MessagesComponent extends BaseReport implements OnInit {
   @ViewChild('chartData', { static: false }) chartData;

   constructor(private coreService: CoreService,
               private ngRoute: ActivatedRoute) {
      super(ngRoute);
   }

   getMetrics() {
      this.coreService.getMessagesMetrics(this.selectedPeriod).subscribe((data: MessageMetrics) => {
         this.metrics = data;
         if (data.messagePerformance) {
            // TODO strongly type
            const config = new MultiLineChartConfig(0, 0, 'dayNumber', 'count', [], 'dayLabel', []);
            this.periodPerformanceConfig = this.createPeriodPerformanceConfig(
               data.messagePerformance,
               config,
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

         // TODO strongly type
         this.heatMapData = this.createTimeOfDayConfig(data.messagesByHour, 'total', 'Total Messages');
      });
   }

   createQuickStats(data) {
      return [
         new QuickStat('messages', data.totalMessages || 0, 'Messages'),
         new QuickStat('incoming', data.totalMessagesIncoming  || 0, 'Incoming Messages'),
         new QuickStat('outgoing', data.totalMessagesOutgoing  || 0, 'Outgoing Messages'),
         new QuickStat('total-messages-female', data.totalMessagesFemale  || 0, 'Total Messages (Female)'),
         new QuickStat('total-messages-male', data.totalMessagesMale  || 0, 'Total Messages (Male)'),
         new QuickStat('average-female-text-length', data.averageOutgoingTextLengthFemale  || 0, 'Average Outgoing Text Length (Female)'),
         new QuickStat('average-male-text-length', data.averageOutgoingTextLengthMale  || 0, 'Average Outgoing Text Length (Male)'),
         new QuickStat(`week-over-week ${this.weekOverWeekPercent < 0 ? 'negative' : 'positive'}`,
            this.weekOverWeekPercent  || 0, 'Week over Week', NumberType.Percent),
         new QuickStat(`period-percent ${this.periodPerformancePercent < 0 ? 'negative' : 'positive'}`,
            this.periodPerformancePercent  || 0, 'Period Performance', NumberType.Percent),
         new QuickStat('unqiue-contacts', data.uniqueContacts || 0, 'Unique Contacts'),
      ];
   }


   createDayOfWeekConfig(data: MessagesDayOfWeek[]) {
      const yDomainMax = Math.max(...data.map(d => d.total));
      const labels = [
         //TODO strongly type these properties
         {xProperty: 'dayOfWeek', yProperty: 'incoming', value: 'Incoming' },
         {xProperty: 'dayOfWeek', yProperty: 'outgoing', value: 'Outgoing' }
      ];
      const tooltipFunction = TooltipHelper.generateStackedBarChartTooltip(labels);
      return new StackedBarChartConfig(yDomainMax, 'dayOfWeek', 'total', data, [ 'incoming', 'outgoing' ], tooltipFunction);
   }

}
