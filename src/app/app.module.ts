import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { LandingComponent } from './landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParticleBackgroundComponent } from './landing/components/particle-background/particle-background.component';
import { LogoLooperComponent } from './landing/components/logo-looper/logo-looper.component';
import { AnimoconsComponent } from './landing/components/animocons/animocons.component';
import { ThreeBackgroundComponent } from './landing/components/three-background/three-background.component';
import { SharedModule } from './shared/shared.module';
import { AppConfigService } from './services/app-config.service';

@NgModule({
   imports: [
      SharedModule,
      BrowserAnimationsModule,
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
   ],
   declarations: [
      AppComponent,
      LandingComponent,
      ParticleBackgroundComponent,
      LogoLooperComponent,
      AnimoconsComponent,
      ThreeBackgroundComponent,
   ],
   providers: [
      {
         provide: APP_INITIALIZER,
         multi: true,
         deps: [AppConfigService],
         useFactory: (appConfigService: AppConfigService) => {
            return () => {
               return appConfigService.loadAppConfig();
            };
         },
      },
   ],
   bootstrap: [AppComponent],
})
export class AppModule {}
