import {
   AfterViewInit, Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit,
   ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import * as Hammer from 'hammerjs/hammer.js';
import {
   dataTransition,
   howTransition, landingTransition, mainLandingTransition, splashTransition,
   whatTransition
} from './landing.transitions';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: [ './landing.component.scss' ],
   animations: [ landingTransition, mainLandingTransition, whatTransition, howTransition, dataTransition,
      splashTransition ],
})
export class LandingComponent implements OnDestroy, OnInit, AfterViewInit {
   @HostBinding('@landingTransition') transitionState: string;
   public aboutSectionHeight = window.innerHeight;
   public active = false;
   public isChangingScreens = false;
   public currentScreen = 'main';
   public hammer: any;
   public screens = [
      'main',
      'what',
      'data',
      'how'
   ];
   public wheelEvent = (event) => this.transitionView(event);

   constructor(private router: Router,
               private elRef: ElementRef) {
   }

   ngOnInit() {
      this.transitionState = 'on';
      window.addEventListener('wheel', this.wheelEvent);

   }

   ngAfterViewInit() {
      this.hammer = new Hammer(this.elRef.nativeElement);
      this.hammer.get('swipe').set({ direction: Hammer['DIRECTION_VERTICAL'] });
      this.hammer.on('swipe', (ev) => {
         if (!this.isChangingScreens) {
            this.isChangingScreens = true;
            let index = this.screens.indexOf(this.currentScreen);
            if (ev.direction === Hammer['DIRECTION_UP']) {
               index = (index + 1) % 4;
            }
            else {
               index = index - 1 < 0 ? 3 : index - 1;
            }
            this.currentScreen = this.screens[ index ];
            setTimeout(() => {
               this.isChangingScreens = false;

            }, 1900); // Time for transitions to occur
         }
      });
   }

   transitionView(event) {
      if (!this.isChangingScreens) {
         this.isChangingScreens = true;
         let index = this.screens.indexOf(this.currentScreen);
         if (event.deltaY > 0) { // Scrolling down
            index = (index + 1) % 4;
         }
         else { // Scrolling up
            index = index - 1 < 0 ? 3 : index - 1;
         }
         this.currentScreen = this.screens[ index ];
         setTimeout(() => {
            this.isChangingScreens = false;

         }, 1600); // Time for transitions to occur
      }
   }

   onShowDataButttonClick() {
      this.transitionState = 'destroy';
      setTimeout(() => {
         this.router.navigate([ '/reports' ]);
      }, 1900); // Allow time for the landingTransition animation to complete
   }

   setActive() {
      this.active = !this.active;
   }

   @HostListener('window:resize', [ '$event' ])
   onResize(event) {
      this.setAboutSectionHeight();
   }

   setAboutSectionHeight() {
      this.aboutSectionHeight = window.innerHeight;
   }

   ngOnDestroy() {
      window.removeEventListener('wheel', this.wheelEvent);
      this.hammer.destroy();
   }

}
