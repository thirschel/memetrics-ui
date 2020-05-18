import { Component, HostBinding, Input } from '@angular/core';

@Component({
   selector: 'app-logo',
   templateUrl: './logo.component.html',
   styleUrls: [ './logo.component.scss' ]
})
export class LogoComponent {

   @Input() size = 'large';

   @HostBinding('class.small')
   public get getSize() {
      return this.size === 'small';
   }

   constructor() {
   }

}
