import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivilegeRoutingModule } from './privilege-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, PrivilegeRoutingModule, SharedModule],
})
export class PrivilegeModule {}
