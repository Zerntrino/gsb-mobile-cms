import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallmentPlanRoutingModule } from './installment-plan-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, InstallmentPlanRoutingModule, SharedModule],
})
export class InstallmentPlanModule {}
