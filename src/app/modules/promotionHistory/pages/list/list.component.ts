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
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';

@Component({
  selector: 'app-promotion-history-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  type: Select2Value = 1;
  typeOption: Select2Option[] = [
    {
      value: 1,
      label: 'โปรโมชันลงทะเบียนรับสิทธิ์',
    },
    {
      value: 2,
      label: 'โปรโมชั่นไม่ลงทะเบียนรับสิทธิ์',
    },
    {
      value: 3,
      label: 'โปรโมชั่นลงทะเบียนรับสิทธิ์',
    },
    {
      value: 4,
      label: 'โปรโมชั่นลงทะเบียนรับสิทธิ์ (แสดงโค้ด)',
    },
  ];

  q = '';
  date1 = ['', ''];
  date2 = ['', ''];

  selectIndex: number[] = [];

  list: PromotionHistory[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(
    private router: Router,
    private promotionService: PromotionService,
    private _location: Location,
    private routeHistory: RouteHistoryService
  ) {}

  ngOnInit(): void {
    this.page = Number(
      this.router.routerState.snapshot.root.queryParams['page'] || 1
    );
    this.pageSize = Number(
      this.router.routerState.snapshot.root.queryParams['pageSize'] || 10
    );
    this.q = this.router.routerState.snapshot.root.queryParams['q'] || '';
    this.date1 = (this.router.routerState.snapshot.root.queryParams[
      'date1'
    ] as []) || ['', ''];
    this.date2 = (this.router.routerState.snapshot.root.queryParams[
      'date2'
    ] as []) || ['', ''];
    this.type = this.router.routerState.snapshot.root.queryParams['type'] || '';

    // this.fetch();
  }

  async fetch(type: number, date: string[], filename: string) {
    let params = new HttpParams()
      .append('page', 1)
      .append('type', type)
      .append('pageSize', 100000);
    if (date[0] && date[1]) {
      params = params
        .append('startDate', dayjs(date[0]).format('YYYY-MM-DDT00:00:00'))
        .append('endDate', dayjs(date[1]).format('YYYY-MM-DDT00:00:00'));
    }

    await this.promotionService.getHistory(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as PromotionHistory[];

        this.downloadJSONAsCSV(this.list, filename);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.page = 1;
    // this.fetch();
  }
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value && e.value != undefined) {
      this.type = e.value;
      this.page = 1;
      // this.fetch();
    }
  }
  date1Change(e: string[]): void {
    this.page = 1;
    this.date1 = e;
  }
  date2Change(e: string[]): void {
    this.page = 1;
    this.date2 = e;
  }

  pageChange(p: number): void {
    this.page = p;
    this.redirect();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this.page = 1;
    this.redirect();
  }
  redirect() {
    this.router.navigate(['/promotion-history'], {
      queryParams: {
        page: this.page,
        pageSize: this.pageSize,
        q: this.q,
        type: this.type,
        date1: this.date1,
        date2: this.date2,
      },
    });
    // this.fetch();
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

  async export1Click() {
    await this.fetch(1, this.date1, 'promotion-history-export.csv');
  }

  async export2Click() {
    await this.fetch(2, this.date2, 'promotion-history-show-code-export.csv');
  }

  downloadJSONAsCSV(jsonData: PromotionHistory[], filename: string) {
    // Convert JSON data to CSV
    let csvData = this.jsonToCsv(jsonData); // Add .items.data
    // Create a CSV file and allow the user to download it
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  }
  jsonToCsv(jsonData: PromotionHistory[]) {
    let csv = '';
    // Get the headers
    let headers = Object.keys(jsonData[0]) as (keyof PromotionHistory)[];
    csv += headers.join(',') + '\n';
    // Add the data
    jsonData.forEach((row: PromotionHistory) => {
      let data = headers.map((header) => row[header] || '').join(',');
      csv += data + '\n';
    });
    return csv;
  }
}
