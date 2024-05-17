import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, CategoryManagementRoutingModule, SharedModule],
})
export class CategoryManagementModule {}
