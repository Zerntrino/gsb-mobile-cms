import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterRoutingModule } from './parameter-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';
import { InstallmentPlanListComponent } from './pages/installment-plan-list/list.component';
import { CreateUpdateComponent } from './pages/createUpdate/create-update.component';
import { ParameterSettingComponent } from './pages/setting/setting.component';

@NgModule({
  declarations: [
    ListComponent,
    CreateUpdateComponent,
    ParameterSettingComponent,
    InstallmentPlanListComponent,
  ],
  imports: [CommonModule, ParameterRoutingModule, SharedModule],
})
export class ParameterModule {}
