import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3/';
import { StackedBarChartConfig } from './stacked-bar-chart';
import { ColorSchemes } from '../color-schemes';

@Component({
   selector: 'app-stacked-bar-chart',
   templateUrl: './stacked-bar-chart.component.html',
   styleUrls: ['./stacked-bar-chart.component.scss']
})
export class StackedBarChartComponent implements OnChanges, AfterViewInit {

   @Input() config: StackedBarChartConfig;
   public chartData: any;
   public margin = {top: 20, right: 20, bottom: 30, left: 30};
   public svg: any;
   public g: any;
   public xAxis: any;
   public yAxis: any;
   public x: any;
   public y: any;
   public z: any;
   public yGrid: any;
   public tooltip: any;
   public uniqueId: string;
   public isInit = false;

   constructor(
      private elementRef: ElementRef) {
         this.uniqueId = `c-${this.guid()}`;
   }

   ngOnChanges() {
      if (this.config && this.config.data.length && this.isInit) {
         if (this.chartData) {
            this.refresh(this.config);
         }
         else{
            this.render(this.config);
         }
      }
   }

   ngAfterViewInit() {
      this.isInit = true;
      if (this.config && this.config.data.length) {
         if (this.chartData) {
            this.refresh(this.config);
         }
         else{
            this.render(this.config);
         }
      }
   }

   resize(config: StackedBarChartConfig) {
      const resizedWidth = this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right;
      this.svg.attr('width', resizedWidth + this.margin.left + this.margin.right);
      this.x = d3.scaleBand().rangeRound([0, resizedWidth]).padding(0.3).align(0.3);
      this.x.domain(this.chartData.map((d) => d[config.xValueProperty]));
      this.svg.selectAll('.bar-value')
         .attr('x', (d) => this.x(d.data[config.xValueProperty]))
         .attr('width', this.x.bandwidth());
      this.xAxis.call(d3.axisBottom(this.x).tickSize(0));
      this.yGrid.call(d3.axisLeft(this.y).tickSize(-resizedWidth).tickFormat(''));
   }

   refresh(config: StackedBarChartConfig) {
      const y = d3.scaleLinear().rangeRound([500 - this.margin.top - this.margin.bottom, 0]);
      y.domain([0, config.yDomainMax]);
      this.y = y;
      this.chartData = config.data;
      const stackData = d3.stack().keys(config.columnProperties)(config.data);
      this.svg.selectAll('.bar-value')
         .transition()
         .ease(d3.easeExp)
         .delay((d, i) => i * 100)
         .duration(1500)
         .attr('height', (d, i) => 0)
         .attr('y', (d, i) => 0);
      this.yAxis.transition().ease(d3.easeExp).duration(1000).attr('opacity', 0);
      setTimeout(() => {
         this.g.selectAll('.series').remove();
         this.g.selectAll('.series')
            .data(stackData)
            .enter().append('g')
            .attr('class', 'series')
            .attr('fill', (d) => this.z(d.key))
            .attr('series-number', (d, i) => i)
            .selectAll('rect')
            .data((d) => d)
            .enter().append('rect')
            .attr('class', 'bar-value')
            .attr('x', (d) => this.x(d.data[config.xValueProperty]))
            .attr('width', this.x.bandwidth())
            .on('mouseover', (d, i, seriesNodes) => {
               const activeSeries = Number(seriesNodes[0].parentNode.getAttribute('series-number'));
               this.g.selectAll('.bar-value').classed('tooltip-active', true);
               seriesNodes[i].classList.add('active-bar');
               this.tooltip
                  .html(config.tooltipFunction(d, this.z, activeSeries))
                  .style('display', 'block');
            })
            .on('mouseout', (d, i, seriesNodes) => {
               this.g.selectAll('.bar-value').classed('tooltip-active', false);
               seriesNodes[i].classList.remove('active-bar');
               this.tooltip
                  .style('display', 'none');
            })
            .transition()
            .ease(d3.easeExp)
            .delay((d, i) => i * 100)
            .duration(1500)
            .attr('y', (d) => y(d[1]))
            .attr('height', (d) => this.y(d[0]) - this.y(d[1]));
         this.yAxis.call(d3.axisLeft(this.y).ticks(10, 's').tickSize(0));
         this.yAxis.transition().ease(d3.easeExp).duration(1000).attr('opacity', 1);
      }, 2300);
   }

   render(config: StackedBarChartConfig) {
      const margin = {top: 20, right: 20, bottom: 30, left: 40},
         width = this.elementRef.nativeElement.getBoundingClientRect().width - margin.left - margin.right,
         height = 500 - margin.top - margin.bottom;

      this.svg = d3.select(`.${this.uniqueId}`)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
      this.x = d3.scaleBand().rangeRound([0, width]).padding(0.3).align(0.3);
      this.y = d3.scaleLinear().rangeRound([height, 0]);
      this.z = d3.scaleOrdinal(ColorSchemes.tableau10);
      this.g = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Scale the range of the data in the domains
      this.x.domain(config.data.map((d) => d[config.xValueProperty]));
      this.y.domain([0, config.yDomainMax]);
      // data.columns = ['incomingMessages', 'outgoingMessages'];
      this.chartData = config.data;
      this.tooltip = d3.select(`body`).append('div')
         .attr('class', 'bar-chart-tooltip')
         .style('display', 'none');
      this.svg.on('mousemove', () => {
         this.tooltip
            .style('left', (d3.event.pageX + 5) + 'px')
            .style('top', (d3.event.pageY - 5) + 'px');
      });

      this.yGrid = this.g.append('g')
         .attr('class', 'y-grid')
         .call(d3.axisLeft(this.y)
            .tickSize(-width)
            .tickFormat('')); // Create an axis component with d3.axisLeft


      this.g.selectAll('.series')
         .data(d3.stack().keys(config.columnProperties)(config.data))
         .enter().append('g')
         .attr('class', 'series')
         .attr('series-number', (d, i) => i)
         .attr('fill', (d) => this.z(d.key))
         .selectAll('rect')
         .data((d) => d)
         .enter().append('rect')
         .attr('class', 'bar-value')
         .attr('x', (d) => this.x(d.data[config.xValueProperty]))
         .attr('width', this.x.bandwidth())
         .on('mouseover', (d, i, seriesNodes) => {
            const activeSeries = Number(seriesNodes[0].parentNode.getAttribute('series-number'));
            this.g.selectAll('.bar-value').classed('tooltip-active', true);
            seriesNodes[i].classList.add('active-bar');
            this.tooltip
               .html(config.tooltipFunction(d, this.z, activeSeries))
               .style('display', 'block');
         })
         .on('mouseout', (d, i, seriesNodes) => {
            this.g.selectAll('.bar-value').classed('tooltip-active', false);
            seriesNodes[i].classList.remove('active-bar');
            this.tooltip
               .style('display', 'none');
         })
         .transition()
         .ease(d3.easeExp)
         .delay((d, i) => i * 100)
         .duration(1500)
         .attr('y', (d) => this.y(d[1]))
         .attr('height', (d) => this.y(d[0]) - this.y(d[1]));

      this.xAxis = this.g.append('g')
         .attr('class', 'axis axis--x')
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(this.x).tickSize(0));

      this.yAxis = this.g.append('g')
         .attr('class', 'axis axis--y')
         .call(d3.axisLeft(this.y).ticks(10, 's').tickSize(0));


   }

   @HostListener('window:resize', ['$event'])
   onResize(event) {
      if (this.chartData) {
         this.resize(this.config);
      }
   }

   generateToolTipHtml(d, z) {
      let html = '';
      const outgoingClass = d[0] === d.data.incomingMessages ? 'outgoing active' : 'outgoing';
      const incomingClass = d[1] === d.data.incomingMessages ? 'incoming active' : 'incoming';
      html += `<div class='x-value'>${d.data.dayOfWeek}</div>`;
      html += `<div class='${outgoingClass} y-value'>
         <span class="color-block" style="background:${z('outgoingMessages')}"></span>
         <span class="label">Outgoing </span><span class="value">${d.data.outgoingMessages}</span></div>`;
      html += `<div class='${incomingClass} y-value'>
         <span class="color-block" style="background:${z('incomingMessages')}"></span>
         <span class="label">Incoming</span><span class="value">${d.data.incomingMessages}</span></div>`;
      return html;
   }

   guid() {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   }

   ngOnDestroy() {
      d3.select('.bar-chart-tooltip').remove();
   }
}
