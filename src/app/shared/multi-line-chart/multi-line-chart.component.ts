import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { MultiLineChartConfig } from './multi-line-chart';
import { ColorSchemes } from '../color-schemes';

@Component({
   selector: 'app-multi-line-chart',
   templateUrl: './multi-line-chart.component.html',
   styleUrls: [ './multi-line-chart.component.scss' ]
})
export class MultiLineChartComponent implements OnChanges, AfterViewInit {

   @Input() config: any;
   @Input() currentData: any;
   public chartData: any;
   public uniqueId: string;
   public margin = { top: 50, right: 20, bottom: 50, left: 40 };
   public svg: any;
   public g: any;
   public x: any;
   public y: any;
   public xAxis: any;
   public yAxis: any;
   public yGrid: any;
   public line: any;
   public isInit = false;
   public colors = ColorSchemes.tableau10;


   constructor(private elementRef: ElementRef) {
      this.uniqueId = `c-${this.guid()}`;
   }

   ngOnChanges(changes) {
      if (this.config && this.config.lines.length && this.isInit) {
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
      if (this.config && this.config.lines.length) {
         if (this.chartData) {
            this.refresh(this.config);
         }
         else {
            this.render(this.config);
         }
      }
   }

   generateX(width: number) {
      return this.config.xAxisIsTime ?
         d3.scaleTime().domain(d3.extent(this.config.lines[ 0 ], (d) => d[ this.config.xValueProperty ])).range([ 0, width ]) :
         d3.scaleLinear().domain([ 0, this.config.xDomainMax ]).range([ 0, width ]);

   }

   refresh(data) {
      const resizedWidth = this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right;
      const height = 500 - this.margin.top - this.margin.bottom;
      this.y = d3.scaleLinear().domain([ 0, data.yDomainMax ]).range([ height, 0 ]); // output
      this.x = this.generateX(resizedWidth);
      this.yAxis.transition().ease(d3.easeExp).duration(1000).attr('opacity', 0);
      this.xAxis.call(d3.axisBottom(this.x).tickSize(0));
      this.yGrid.call(d3.axisLeft(this.y).tickSize(-resizedWidth).tickFormat(''));
      this.yAxis.call(d3.axisLeft(this.y).ticks(5).tickSize(0));
      this.g.selectAll(`.focus.c-${this.uniqueId}`).remove();
      this.g.selectAll(`.x-indicator.c-${this.uniqueId}`).remove();
      this.g.selectAll(`.overlay.c-${this.uniqueId}`).remove();
      this.renderFocusLines(this.config, height, resizedWidth);
      this.line = d3.line()
         .x((d) => this.x(d[ this.config.xValueProperty ]))
         .y((d) => this.y(d[ this.config.yValueProperty ]))
         .curve(d3.curveMonotoneX);
      if (this.svg.selectAll(`.line.${this.uniqueId}`)._groups[0].length > data.lines.length){
         for (let i = 0; i < this.svg.selectAll(`.line.${this.uniqueId}`)._groups[0].length - data.lines.length; i++){
            this.svg.selectAll(`.line.${this.uniqueId}`)._groups[0][i].remove();
         }
      }
      this.svg.selectAll(`.line.${this.uniqueId}`)
         .transition()
         .ease(d3.easeExp)
         .delay((d, i) => i * 100)
         .duration(1500)
         .attr('stroke', (d, i)  => this.colors[ i ])
         .attr('d', (d, i) => {
            return data.lines[ i ] ? this.line((data.lines[ i ])) : 0;
         });
      if (this.svg.selectAll(`.line.${this.uniqueId}`)._groups[0].length < data.lines.length) {
         for (let i = this.svg.selectAll(`.line.${this.uniqueId}`)._groups[0].length; i < data.lines.length; i++){
            this.createLine(data.lines[i], i);
         }
      }

      setTimeout(() => {
         this.yAxis.transition().ease(d3.easeExp).duration(1000).attr('opacity', 1);
      }, 500);
   }

   resize() {
      const resizedWidth = this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right;
      this.svg.attr('width', resizedWidth + this.margin.left + this.margin.right);
      this.x = this.generateX(resizedWidth);
      this.line = d3.line()
         .x((d) => this.x(d[ this.config.xValueProperty ]))
         .y((d) => this.y(d[ this.config.yValueProperty ]))
         .curve(d3.curveMonotoneX);
      this.svg.selectAll(`.line.${this.uniqueId}`)
         .attr('d', (d, i) => {
            if (this.config.lines[ i ]) {
               return this.line((this.config.lines[ i ]));
            }
         });
      this.xAxis.call(d3.axisBottom(this.x).tickSize(0));
      this.svg.select('.overlay').attr('width', resizedWidth);
      this.yGrid.call(d3.axisLeft(this.y)
         .tickSize(-resizedWidth)
         .tickFormat(''));
   }

   render(config: MultiLineChartConfig) {
      const width = this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right; // Use the window's width
      const height = 500 - this.margin.top - this.margin.bottom;

      this.x = this.generateX(width);

      this.y = d3.scaleLinear()
         .domain([ 0, config.yDomainMax ]) // input
         .range([ height, 0 ]); // output

      this.line = d3.line()
         .x((d) => this.x(d[ config.xValueProperty ]))
         .y((d) => this.y(d[ config.yValueProperty ]))
         .curve(d3.curveMonotoneX); // apply smoothing to the line


      this.svg = d3.select(`.${this.uniqueId}`)
         .attr('width', width + this.margin.left + this.margin.right)
         .attr('height', height + this.margin.top + this.margin.bottom);
      this.g = this.svg.append('g')
         .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      this.xAxis = this.g.append('g')
         .attr('class', 'x axis')
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(this.x)
            .tickSize(0)); // Create an axis component with d3.axisBottom

      this.yGrid = this.g.append('g')
         .attr('class', 'y-grid')
         .call(d3.axisLeft(this.y)
            .tickSize(-width)
            .tickFormat('')); // Create an axis component with d3.axisLeft
      this.yAxis = this.g.append('g')
         .attr('class', 'y axis')
         .call(d3.axisLeft(this.y)
            .ticks(5)
            .tickSize(0)); // Create an axis component with d3.axisLeft


      this.chartData = config;
      config.lines.forEach((lineData, i) => {
         this.createLine(lineData, i);
      });
      this.renderFocusLines(config, height, width);
   }

   createLine(lineData: any, i: number) {
      const lineAvg = lineData.reduce((a, b) => a += b[ this.config.yValueProperty ], 0) / lineData.length;
      const tempData = JSON.parse(JSON.stringify(lineData)).map(l => {
         l[ this.config.yValueProperty ] = lineAvg;
         if (this.config.xAxisIsTime) {
            l[ this.config.xValueProperty ] = new Date(l[ this.config.xValueProperty ]);
         }
         return l;
      });
      this.g.append('path')
         .attr('class', `line ${this.uniqueId}`) // Assign a class for styling
         .attr('d', this.line(tempData))
         .style('opacity', '0')
         .attr('stroke', this.colors[ i ])
         .transition()
         .ease(d3.easeExp)
         .delay((d, i) => i * 100)
         .duration(1500)
         .style('opacity', '1')
         .attr('d', this.line(lineData));
   }

   renderFocusLines(config, height, width) {
      const focusLines = [];
      config.lines.forEach((lineData, i) => {
         const focus = this.g.append('g')
            .attr('class', `focus c-${this.uniqueId}`)
            .style('display', 'none');

         focus.append('text')
            .attr('class', 'value')
            .attr('fill', `${this.colors[ i ]}`)
            .attr('stroke', '#FFF')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('stroke-width', '.5')
            .attr('x', 9)
            .attr('dy', '.35em');

         focus.append('text')
            .attr('class', 'label')
            .attr('x', 15)
            .attr('dy', '.35em');

         focusLines.push(focus);
      });

      const focusLine = this.g.append('g')
         .attr('class', `x-indicator c-${this.uniqueId}`);
      focusLine.append('line')
         .attr('class', 'focus-line')
         .attr('stroke', '#737373')
         .attr('stroke-dasharray', '2')
         .attr('y2', height);

      focusLine.append('text')
         .attr('x', 0)
         .attr('y', -10)
         .attr('dy', '.35em');

      const bisectDate = d3.bisector(function (d) {
         return d[ config.xValueProperty ];
      }).left;

      const mousemove = () => {
         const x0 = this.x.invert(d3.mouse(rect._groups[ 0 ][ 0 ])[ 0 ]);
         const yValues = [];
         this.config.lines.forEach((lineData, i) => {
            const j = bisectDate(lineData, x0, 1),
               d0 = lineData[ j - 1 ],
               d1 = lineData[ j ];
            if (d1 && d0) {
               const d = x0 - d0[ config.xValueProperty ] > d1[ config.xValueProperty ] - x0 ? d1 : d0;
               focusLines[ i ].select('.value').text(d[ config.yValueProperty ]);
               focusLines[ i ].select('.label').text(config.lineNames[ i ]);
               focusLine.attr('transform', 'translate(' + this.x(d[ config.xValueProperty ]) + ',0)');
               focusLine.select('text').text(d[ config.labelProperty ]);
               const valueWidth = focusLines[ i ].select('.value').node().getComputedTextLength();
               const labelWidth = focusLines[ i ].select('.label').node().getComputedTextLength();
               let yValue = this.y(d[ config.yValueProperty ]);
               if (i === 1 && (yValue - yValues[ 0 ] < 15 || yValues[ 0 ] - yValue < 15)) {
                  yValue = 15 + yValues[ 0 ];
               }
               yValues.push(yValue);
               if (this.x(d[ config.xValueProperty ]) > (this.elementRef.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right) / 2) {
                  focusLine.select('text').attr('x', `-${focusLine.select('text').node().getBoundingClientRect().width}px`);
                  focusLines[ i ].attr('transform', 'translate(' + (this.x(d[ config.xValueProperty ]) - valueWidth - 15) + ',' + yValue + ')');
                  focusLines[ i ].select('.label').attr('x', -labelWidth);
               }
               else {
                  focusLines[ i ].attr('transform', 'translate(' + this.x(d[ config.xValueProperty ]) + ',' + yValue + ')');
                  focusLines[ i ].select('.label').attr('x', 15 + valueWidth);
                  focusLine.select('text').attr('x', 0);
               }
            }
         });
      };

      const rect = this.g.append('rect')
         .attr('class', `overlay c-${this.uniqueId}`)
         .attr('width', width)
         .attr('height', height)
         .on('mouseover', () => {
            config.lines.forEach((lineData, i) => {
               focusLines[ i ].style('display', null);
            });
            focusLine.style('display', null);
         })
         .on('mouseout', () => {
            config.lines.forEach((lineData, i) => {
               focusLines[ i ].style('display', 'none');
            });
            focusLine.style('display', 'none');
         })
         .on('mousemove', mousemove);
   }

   guid() {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   }

   @HostListener('window:resize', [ '$event' ])
   onResize(event) {
      if (this.chartData) {
         this.resize();
      }
   }

}
