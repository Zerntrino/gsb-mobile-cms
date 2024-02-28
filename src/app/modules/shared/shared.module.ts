import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { Error404Component } from './pages/error404/error404.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';
import { TabComponent } from './components/tab/tab.component';

@NgModule({
  declarations: [
    Error404Component,
    LayoutComponent,
    NavComponent,
    TabComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NavComponent, TabComponent, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
