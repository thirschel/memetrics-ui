import { Component } from '@angular/core';
import { reportTransition } from './shared/transitions';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: [ './app.component.scss' ],
   animations: [ reportTransition ]
})
export class AppComponent {

}
