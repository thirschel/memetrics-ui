import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class BaseHttpService {
   constructor(
      private http: HttpClient,
      private appConfigService: AppConfigService
   ) {}

   private getHeaders(customHeaders: HttpHeaders = null): Promise<HttpHeaders> {
      if (!customHeaders) {
         customHeaders = new HttpHeaders();
      }

      customHeaders = customHeaders
         .set('Cache-Control', 'no-cache,no-store')
         .set('Pragma', 'no-cache')
         .set('Content-Type', 'application/json');

      return Promise.resolve(customHeaders);
   }

   delete(url: string): Observable<any> {
      const subject = new Subject();
      this.getHeaders().then((headers) => {
         this.http
            .delete(`${this.appConfigService.apiBaseUrl}/${url}`, { headers })
            .subscribe(subject);
      });

      return subject;
   }

   get(url: string, params: HttpParams = null): Observable<any> {
      const subject = new Subject();
      this.getHeaders().then((headers) => {
         this.http
            .get(`${this.appConfigService.apiBaseUrl}/${url}`, {
               params,
               headers,
            })
            .subscribe(subject);
      });

      return subject;
   }

   post(url: string, body: any): Observable<any> {
      const subject = new Subject();
      this.getHeaders().then((headers) => {
         this.http
            .post(`${this.appConfigService.apiBaseUrl}/${url}`, body, {
               headers,
            })
            .subscribe(subject);
      });

      return subject;
   }

   put(url: string, body: any): Observable<any> {
      const subject = new Subject();
      this.getHeaders().then((headers) => {
         this.http
            .put(`${this.appConfigService.apiBaseUrl}/${url}`, body, {
               headers,
            })
            .subscribe(subject);
      });

      return subject;
   }
}
