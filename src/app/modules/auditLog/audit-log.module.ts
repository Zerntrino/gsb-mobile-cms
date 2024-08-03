import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogRoutingModule } from './audit-log-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, AuditLogRoutingModule, SharedModule],
})
export class AuditLogModule {}
