import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { InstallmentPlanListComponent } from './pages/installment-plan-list/list.component';
import { CreateUpdateComponent } from './pages/createUpdate/create-update.component';
import { ParameterSettingComponent } from './pages/setting/setting.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'installment-plan',
    component: InstallmentPlanListComponent,
  },
  {
    path: 'setting',
    component: ParameterSettingComponent,
  },
  {
    path: ':id',
    component: CreateUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterRoutingModule {}
