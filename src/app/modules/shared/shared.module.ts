import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { Error404Component } from './pages/error404/error404.component';

@NgModule({
  declarations: [Error404Component, LayoutComponent],
  imports: [CommonModule, RouterModule, RouterOutlet],
  exports: [],
})
export class SharedModule {}
