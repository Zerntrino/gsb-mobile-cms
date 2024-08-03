import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityLogRoutingModule } from './security-log-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, SecurityLogRoutingModule, SharedModule],
})
export class SecurityLogModule {}
