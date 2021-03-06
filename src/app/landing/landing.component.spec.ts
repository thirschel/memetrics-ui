import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LandingComponent', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, NoopAnimationsModule],
         declarations: [LandingComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
