import { NgModule } from '@angular/core';

import { ReportsRoutes } from './reports.routes';
import { SharedModule } from '../shared/shared.module';
import { MessagesComponent } from './messages/messages.component';
import { CallsComponent } from './calls/calls.component';
import { RidesComponent } from './rides/rides.component';
import { RecruitersComponent } from './recruiters/recruiters.component';
import { ReportComponent } from './report/report.component';
import { BaseHttpService } from '../services/base-http.service';
import { CoreService } from '../services/core.service';
import { CommonModule } from '@angular/common';

@NgModule({
   imports: [
      CommonModule,
      SharedModule,
      ReportsRoutes,
   ],
   declarations: [
      MessagesComponent,
      CallsComponent,
      RidesComponent,
      RecruitersComponent,
      ReportComponent
   ],
   providers: [
      BaseHttpService,
      CoreService,
   ],
})
export class ReportsModule {
}
