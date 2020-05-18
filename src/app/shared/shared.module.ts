import { NgModule } from '@angular/core';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { MultiLineChartComponent } from './multi-line-chart/multi-line-chart.component';
import { HeatMapChartComponent } from './heat-map-chart/heat-map-chart.component';
import { NumberCounterComponent } from './number-counter/number-counter.component';
import { NumberCounterDirective } from './number-counter/number-counter.directive';
import { WordFlipperComponent } from './word-flipper/word-flipper.component';
import { LogoComponent } from './logo/logo.component';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
   ],
   declarations: [
      DropdownComponent,
      StackedBarChartComponent,
      MultiLineChartComponent,
      HeatMapChartComponent,
      NumberCounterComponent,
      NumberCounterDirective,
      WordFlipperComponent,
      LogoComponent
   ],
   exports: [
      DropdownComponent,
      StackedBarChartComponent,
      MultiLineChartComponent,
      HeatMapChartComponent,
      NumberCounterComponent,
      NumberCounterDirective,
      WordFlipperComponent,
      LogoComponent
   ],
   providers: [],
})
export class SharedModule {
}
