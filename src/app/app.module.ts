import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';

import dayjs from 'dayjs';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

var buddhistEra = require('dayjs/plugin/buddhistEra');
dayjs.extend(buddhistEra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    CoreModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'th' },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useValue: 'th',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
