import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../models/app-config';

@Injectable({
   providedIn: 'root',
})
export class AppConfigService {
   private appConfig: AppConfig;

   constructor(private http: HttpClient) {}

   loadAppConfig() {
      return this.http
         .get('/assets/appsettings.json')
         .toPromise()
         .then((data: AppConfig) => {
            this.appConfig = data;
         });
   }

   // This is an example property ... you can make it however you want.
   get apiBaseUrl() {
      if (!this.appConfig) {
         throw Error('Config file not loaded!');
      }

      return this.appConfig.apiUrl;
   }

   get appInsightsConfig() {
      return this.appConfig.appInsightsInstrumentationKey;
   }
}
