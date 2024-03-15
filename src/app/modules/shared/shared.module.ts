import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { Error404Component } from './pages/error404/error404.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';
import { TabComponent } from './components/tab/tab.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { Select2Module } from 'ng-select2-component';
import { PaginationComponent } from './components/pagination/pagination.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    Error404Component,
    LayoutComponent,
    NavComponent,
    TabComponent,
    DropdownComponent,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    Select2Module,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [
    NavComponent,
    TabComponent,
    DropdownComponent,
    PaginationComponent,
    Select2Module,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
})
export class SharedModule {}
