import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const appRoutes: Routes = [
   { path: '', component: LandingComponent },
   { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
   { path: '**', redirectTo: '' },
];

@NgModule({
   imports: [RouterModule.forRoot(appRoutes)],
   exports: [RouterModule],
})
export class AppRoutingModule { }
