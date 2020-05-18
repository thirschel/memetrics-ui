import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { MessagesComponent } from './messages/messages.component';
import { CallsComponent } from './calls/calls.component';
import { RidesComponent } from './rides/rides.component';
import { RecruitersComponent } from './recruiters/recruiters.component';
import { PeriodSelectionEnum } from '../enums/PeriodSelectionEnum';

export const reportsRoutes: Routes = [
   {
      path: '',
      component: ReportComponent,
      children: [
         {
            path: 'messages/:period',
            component: MessagesComponent,
         },
         {
            path: 'calls/:period',
            component: CallsComponent,
         },
         {
            path: 'rides/:period',
            component: RidesComponent,
         },
         {
            path: 'recruiters/:period',
            component: RecruitersComponent,
         },
         { path: '**', redirectTo: `messages/${PeriodSelectionEnum.ThisYear}` },
      ],
   },
];

export const ReportsRoutes = RouterModule.forChild(reportsRoutes);
