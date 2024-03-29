import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { PromotionService } from 'src/app/core/services/promotion.service';
import { PromotionHistory } from 'src/app/core/models/promotion.model';
import { find, get, pull } from 'lodash';

@Component({
  selector: 'app-promotion-history-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  type: Select2Value = 'โปรโมชันลงทะเบียนรับสิทธิ์';
  typeOption: Select2Option[] = [
    {
      value: 'โปรโมชันลงทะเบียนรับสิทธิ์',
      label: 'โปรโมชันลงทะเบียนรับสิทธิ์',
    },
  ];

  q = '';
  date = ['', ''];

  selectIndex: number[] = [];

  list: PromotionHistory[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(
    private router: Router,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('length', this.pageSize);
    if (this.q) params = params.append('find', this.q);

    if (this.type) params = params.append('type', this.type as string);
    if (this.date[0] && this.date[1]) {
      params = params.append('startDate', this.date[0]);
      params = params.append('endDate', this.date[0]);
    }

    this.promotionService.getHistory(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as PromotionHistory[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.fetch();
  }
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;
      this.fetch();
    }
  }
  dateChange(e: string[]): void {
    this.date = e;
  }

  pageChange(p: number): void {
    this.page = p;
    this.fetch();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this.fetch();
  }
  selectIndexAllClick(v: boolean): void {
    this.selectIndex = [];
    if (v)
      this.list.forEach((e, i) => {
        this.selectIndex.push(i);
      });
  }
  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  pull(ar: number[], i: number): number[] {
    return pull(ar, i);
  }
  exportClick(): void {
    console.log(this.selectIndex);
  }
}
