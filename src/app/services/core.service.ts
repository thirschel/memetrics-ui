import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { PeriodSelectionEnum } from '../enums/PeriodSelectionEnum';

@Injectable()
export class CoreService {

   constructor(private httpService: BaseHttpService) {
   }

   getMessagesMetrics(selectedPeriod: PeriodSelectionEnum) {
      return this.httpService.get(`api/v1/messages/metrics?selectedPeriod=${selectedPeriod}`);
   }

   getCallsMetrics(selectedPeriod: PeriodSelectionEnum) {
      return this.httpService.get(`api/v1/calls/metrics?selectedPeriod=${selectedPeriod}`);
   }

   getRidesMetrics(selectedPeriod: PeriodSelectionEnum) {
      return this.httpService.get(`api/v1/rides/metrics?selectedPeriod=${selectedPeriod}`);
   }

   getRecruitersMetrics(selectedPeriod: PeriodSelectionEnum) {
      return this.httpService.get(`api/v1/recruitment-messages/metrics?selectedPeriod=${selectedPeriod}`);
   }
}
