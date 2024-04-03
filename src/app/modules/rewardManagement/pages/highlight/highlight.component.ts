import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PromotionService } from 'src/app/core/services/promotion.service';
import { Promotion } from 'src/app/core/models/promotion.model';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';

@Component({
  selector: 'app-reward-management-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit {
  navItems = [
    {
      title: 'จัดการรีวอร์ด/เลือกไฮไลท์ : รีวอร์ด',
      to: '',
    },
    { title: 'จัดการไฮไลท์ : รีวอร์ด', to: '' },
  ];

  type: Select2Value = 'GSB Reward Point แลก Cashback';
  typeOption: Select2Option[] = [
    {
      value: 'GSB Reward Point แลก Cashback',
      label: 'GSB Reward Point แลก Cashback',
    },
  ];

  list: Promotion[] = [];
  showSelected = false;
  q = '';

  constructor(
    private router: Router,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.promotionService.getHighlights().subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Promotion[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    console.log(this.list);
  }

  qChange(): void {}
  selectedClick(): void {
    this.showSelected = false;
  }

  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;
      this.fetch();
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
}
