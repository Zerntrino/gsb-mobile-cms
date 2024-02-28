import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './pages/search/search.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './pages/detail/detail.component';
import { CardDetailComponent } from './pages/cardDetail/card-detail.component';

@NgModule({
  declarations: [SearchComponent, DetailComponent, CardDetailComponent],
  imports: [CommonModule, UserManagementRoutingModule, SharedModule],
})
export class UserManagementModule {}
