import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateUpdateComponent } from './pages/createUpdate/create-update.component';
import { HighlightComponent } from './pages/highlight/highlight.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'highlight',
    component: HighlightComponent,
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
export class RewardManagementRoutingModule {}
