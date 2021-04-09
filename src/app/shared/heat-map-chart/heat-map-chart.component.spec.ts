import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeatMapChartComponent } from './heat-map-chart.component';

describe('HeatMapChartComponent', () => {
   let component: HeatMapChartComponent;
   let fixture: ComponentFixture<HeatMapChartComponent>;

   beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
         declarations: [ HeatMapChartComponent ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(HeatMapChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
