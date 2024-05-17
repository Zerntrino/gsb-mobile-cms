import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { PartnerManagementRoutingModule } from './partner-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CreateUpdateComponent } from './pages/createUpdate/create-update.component';

@NgModule({
  declarations: [ListComponent, CreateUpdateComponent],
  imports: [CommonModule, PartnerManagementRoutingModule, SharedModule],
})
export class PartnerManagementModule {}
