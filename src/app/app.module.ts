import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  LOCALE_ID,
  Injectable,
  importProvidersFrom,
} from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import dayjs from 'dayjs';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

var buddhistEra = require('dayjs/plugin/buddhistEra');

dayjs.extend(buddhistEra);

import { environment } from '../environments/environment';

const oktaAuth = new OktaAuth({
  pkce: false,
  issuer: environment.OAUTH2_ISSUER || 'https://mfapwldev.gsb.or.th',
  clientId: environment.OAUTH2_CLIENT_ID || '0oa1uk5axxcJJh8mB1d8',
  redirectUri:
    environment.OAUTH2_REDIRECT_URI ||
    'http://gsbmycardsit.gsb.or.th/api/authen/callback', //window.location.origin + '/api/authen/callback',
  scopes: ['openid', 'profile', 'offline_access'],
  responseType: 'code',
});
console.log('isPKCESupported', oktaAuth.features.isPKCESupported());

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    CoreModule,
    OktaAuthModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'th' },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useValue: 'th',
    },
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    // { provide: OktaAuth, useValue: oktaAuth },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
