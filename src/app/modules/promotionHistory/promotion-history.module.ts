import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionHistoryRoutingModule } from './promotion-history-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, PromotionHistoryRoutingModule, SharedModule],
})
export class PromotionHistoryModule {}
