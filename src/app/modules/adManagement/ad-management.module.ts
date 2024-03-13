import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { AdManagementRoutingModule } from './ad-management-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, AdManagementRoutingModule, SharedModule],
})
export class AdManagementModule {}
