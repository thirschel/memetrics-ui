import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Loader } from './classes/loader';
import { System } from './classes/system';

@Component({
   selector: 'three-background',
   templateUrl: './three-background.component.html',
   styleUrls: ['./three-background.component.scss']
})
export class ThreeBackgroundComponent implements AfterViewInit {

   public loader: Loader;

   constructor() { }

   ngAfterViewInit() {
      this.loader = new Loader(System);
   }
}
