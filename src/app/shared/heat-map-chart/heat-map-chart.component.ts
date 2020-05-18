import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HeatMapConfig } from './heat-map';

@Component({
   selector: 'app-heat-map-chart',
   templateUrl: './heat-map-chart.component.html',
   styleUrls: [ './heat-map-chart.component.scss' ]
})
export class HeatMapChartComponent implements OnChanges, AfterViewInit {

   @Input() config: HeatMapConfig;
   public currentData: any;
   public chartData: any;
   public uniqueId: string;
   public margin = { top: 50, right: 0, bottom: 100, left: 40 };
   public days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
   public times = [ '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12pm' ];
   public svg: any;
   public g: any;
   public xAxis: any;
   public yAxis: any;
   public dayLabels: any;
   public timeLabels: any;
   public legendBlocks: any;
   public legendText: any;
   public squares: any;
   public isInit = false;
   public xLabels;
   public yLabels;
   public refresh;

   constructor(private elementRef: ElementRef) {
      this.uniqueId = `c-${this.guid()}`;
   }

   ngOnChanges() {
      if (this.config && this.config.blocks.length && this.isInit) {
         if (this.chartData) {
            this.refresh(this.config);
         }
         else {
            this.render(this.config);
         }
      }
   }

   ngAfterViewInit() {
      this.isInit = true;
      if (this.config && this.config.blocks.length) {
         if (this.chartData) {
            this.refresh(this.config);
         }
         else {
            this.render(this.config);
         }
      }
   }

   resize() {
      const resizedWidth = this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right;
      if (this.elementRef.nativeElement.getBoundingClientRect().width < 550) {
         this.xLabels = this.times;
         this.yLabels = this.days;
      }
      else {
         this.xLabels = this.days;
         this.yLabels = this.times;
      }
      const height = 430 - this.margin.top - this.margin.bottom;
      this.svg.attr('width', resizedWidth + this.margin.left + this.margin.right);
      const gridSize = Math.floor(resizedWidth / this.yLabels.length);
      const legendElementWidth = gridSize * 2;
      this.dayLabels.attr('y', (d, i) => i * gridSize)
         .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')');
      this.timeLabels.attr('x', (d, i) => i * gridSize)
         .attr('transform', 'translate(' + gridSize / 2 + ', -6)');
      this.squares
         .attr('x', (d) => (this.xLabels.length === 7 ? d.hour - 1 : d.day - 1) * gridSize)
         .attr('y', (d) => (this.xLabels.length === 7 ? d.day - 1 : d.hour - 1) * gridSize)
         .attr('width', gridSize)
         .attr('height', gridSize);
      this.legendBlocks
         .attr('x', (d, i) => legendElementWidth * i)
         .attr('y', this.xLabels.length * gridSize + 5)
         .attr('width', legendElementWidth)
         .attr('height', gridSize / 2);
      this.legendText
         .attr('x', (d, i) => legendElementWidth * i)
         .attr('y', (this.xLabels.length * gridSize + 5) + gridSize);

   }


   render(config: HeatMapConfig) {
      if (this.elementRef.nativeElement.getBoundingClientRect().width < 550) {
         this.xLabels = this.times;
         this.yLabels = this.days;
      }
      else {
         this.xLabels = this.days;
         this.yLabels = this.times;
      }
      const width = this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right,
         gridSize = Math.floor(width / this.yLabels.length),
         legendElementWidth = gridSize * 2,
         height = this.xLabels.length * gridSize,
         buckets = 9,
         colors = [ '#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58' ];

      this.svg = d3.select(`.${this.uniqueId}`)
         .attr('width', width + this.margin.left + this.margin.right)
         .attr('height', height + this.margin.top + this.margin.bottom);
      this.g = this.svg.append('g')
         .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      this.chartData = config;
      this.dayLabels = this.g.selectAll('.dayLabel')
         .data(this.xLabels)
         .enter().append('text')
         .text(function (d) {
            return d;
         })
         .attr('x', 0)
         .attr('y', (d, i) => i * gridSize)
         .style('text-anchor', 'end')
         .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
         .attr('class', (d, i) => ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis'));

      this.timeLabels = this.g.selectAll('.timeLabel')
         .data(this.yLabels)
         .enter().append('text')
         .text((d) => d)
         .attr('x', (d, i) => i * gridSize)
         .attr('y', 0)
         .style('text-anchor', 'middle')
         .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
         .attr('class', (d, i) => ((i >= 7 && i <= 16) ? 'timeLabel mono axis axis-worktime' : 'timeLabel mono axis'));

      const type = (d) => {
         return {
            day: +d.day,
            hour: +d.hour,
            value: +d.value
         };
      };

      const tooltip = d3.select(`body`).append('div')
         .attr('class', 'heatmap-tooltip')
         .style('display', 'none');
      this.g.on('mousemove', () => {
         tooltip
            .style('left', (d3.event.pageX + 200 > window.outerWidth ? window.outerWidth - 200 : d3.event.pageX + 5) + 'px')
            .style('top', (d3.event.pageY - 5) + 'px');
      });
      this.refresh = (configuration: HeatMapConfig) => {
         const colorScale = d3.scaleQuantile()
            .domain([ 0, buckets - 1, d3.max(configuration.blocks, (d) => d.value) ])
            .range(colors);

         const cards = this.g.selectAll('.hour')
            .data(configuration.blocks, (d) => d.day + ':' + d.hour);

         cards.append('title');

         this.squares = cards.enter().append('rect')
            .attr('x', (d) => (this.xLabels.length === 7 ? d.hour - 1 : d.day - 1) * gridSize)
            .attr('y', (d) => (this.xLabels.length === 7 ? d.day - 1 : d.hour - 1) * gridSize)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('class', 'hour bordered')
            .attr('width', gridSize)
            .attr('height', gridSize)
            .style('fill', colors[ 0 ])
            .on('mouseover', (d) => {
               tooltip
                  .html(this.generateToolTipHtml(d))
                  .style('display', 'block');
            })
            .on('mouseout', () => {
               tooltip
                  .style('display', 'none');
            })
            .merge(cards);
         this.squares
            .transition()
            .ease(d3.easeExp)
            .delay((d, i) => i * 4)
            .duration(1000)
            .style('fill', (d) => colorScale(d.value));

         cards.select('title').text((d) => d.value);

         cards.exit().remove();

         this.g.selectAll('.legend').remove();

         const legend = this.g.selectAll('.legend')
            .data([ 0 ].concat(colorScale.quantiles()), (d) => d);

         const legend_g = legend.enter().append('g')
            .attr('class', 'legend');

         this.legendBlocks = legend_g.append('rect')
            .attr('x', (d, i) => legendElementWidth * i)
            .attr('y', this.xLabels.length * gridSize + 5)
            .attr('width', legendElementWidth)
            .attr('height', gridSize / 2)
            .style('fill', (d, i) => colors[ i ]);

         this.legendText = legend_g.append('text')
            .attr('class', 'mono')
            .text((d) => '≥ ' + Math.round(d))
            .attr('x', (d, i) => legendElementWidth * i)
            .attr('y', (this.xLabels.length * gridSize + 5) + gridSize);

         legend.exit().remove();
      };

      this.refresh(config);
   }

   @HostListener('window:resize', [ '$event' ])
   onResize(event) {
      if (this.chartData) {
         this.resize();
      }
   }

   generateToolTipHtml(d) {
      let html = '';
      html += `<div class='x-value'>${this.dayFormatter(d.day)}: ${this.hourFormatter(d.hour)}</div>`;
      html += `<div class='y-value'>${this.config.tooltipLabel} ${d.value}</div>`;
      return html;
   }

   dayFormatter(day: number) {
      switch (day) {
         case 1:
            return 'Monday';
         case 2:
            return 'Tuesday';
         case 3:
            return 'Wednesday';
         case 4:
            return 'Thursday';
         case 5:
            return 'Friday';
         case 6:
            return 'Saturday';
         case 7:
            return 'Sunday';
      }
   }

   hourFormatter(hour: number) {
      const suffix = hour >= 12 && hour !== 24 ? 'pm' : 'am';
      hour = hour > 12 ? hour - 12 : hour;
      return `${hour}:00${suffix} - ${hour}:59${suffix}`;
   }

   guid() {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   }
}
