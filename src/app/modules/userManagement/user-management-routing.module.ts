import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CardDetailComponent } from './pages/cardDetail/card-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'card/:id',
    component: CardDetailComponent,
  },
  {
    path: ':id',
    component: DetailComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
