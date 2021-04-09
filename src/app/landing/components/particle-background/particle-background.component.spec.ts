import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticleBackgroundComponent } from './particle-background.component';

describe('ParticleBackgroundComponent', () => {
   let component: ParticleBackgroundComponent;
   let fixture: ComponentFixture<ParticleBackgroundComponent>;

   beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
         declarations: [ ParticleBackgroundComponent ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ParticleBackgroundComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
