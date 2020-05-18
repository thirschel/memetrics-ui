import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/index';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { reportTransition } from '../../shared/transitions';
import { PeriodSelectionEnum } from '../../enums/PeriodSelectionEnum';

@Component({
   selector: 'app-report',
   templateUrl: './report.component.html',
   styleUrls: [ './report.component.scss' ],
   animations: [ reportTransition ]
})
export class ReportComponent implements OnInit {
   public selectedPeriodId = PeriodSelectionEnum.ThisYear;
   public isOpen = false;
   public selectedReport = { id: 1, label: 'Messages', route: 'messages' };
   public periodDropdownValues = [
      { id: PeriodSelectionEnum.AllTime, label: 'All Time' },
      { id: PeriodSelectionEnum.ThisYear, label: 'This Year' },
      { id: PeriodSelectionEnum.LastYear, label: 'Last Year' },
      { id: PeriodSelectionEnum.Rolling30, label: 'Rolling 30 Days' },
      { id: PeriodSelectionEnum.ThisMonth, label: 'This Month' },
   ];
   public reports = [
      { id: 1, label: 'Messages', route: '/reports/messages' },
      { id: 2, label: 'Calls', route: '/reports/calls' },
      { id: 3, label: 'Rides', route: '/reports/rides' },
      { id: 4, label: 'Recruiters', route: '/reports/recruiters' },
   ];

   public subscriptions: Array<Subscription> = [];

   constructor(private router: Router,
               private route: ActivatedRoute) {
   }

   ngOnInit() {
      this.setReportAndPeriodFromUrl(window.location.pathname);
      this.subscriptions.push(
         this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && val.url !== '/') {
               this.setReportAndPeriodFromUrl(val.url);
            }
         })
      );
   }

   setReportAndPeriodFromUrl(url: string) {
      this.selectedReport = this.reports.find(r => r.route.split('/')[ 2 ] === url.split('/')[ 2 ]);
      this.selectedPeriodId = isNaN(Number(url.split('/')[ 3 ])) ? 2 : Number(url.split('/')[ 3 ]);
   }

   goBack() {
      this.router.navigate(['']);
   }

   toggleReportMenu() {
      this.isOpen = !this.isOpen;
   }

   periodChanged(id: number) {
      this.selectedPeriodId = id;
      const report = this.reports.find(r => r.id === this.selectedReport.id);
      this.router.navigate([ `${report.route}/${this.selectedPeriodId}` ]);
   }

   onReportChanged(report) {
      this.isOpen = false;
      this.selectedReport = report;
      this.router.navigate([ `${report.route}/${this.selectedPeriodId}` ]);
   }
}
