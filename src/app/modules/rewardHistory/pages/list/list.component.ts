import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { find, get, pull } from 'lodash';
import { RewardService } from 'src/app/core/services/reward.service';
import { RewardHistory } from 'src/app/core/models/reward.model';
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';

@Component({
  selector: 'app-reward-history-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  type: Select2Value = 1;
  typeOption: Select2Option[] = [
    {
      value: 1,
      label: 'ใช้ Point แลก Cashback',
    },
    {
      value: 2,
      label: 'ใช้ Point แลก ของ',
    },
    {
      value: 3,
      label: 'ใช้ Point แลก Point',
    },
    {
      value: 4,
      label: 'ใช้ Point แลก Code',
    },
  ];

  q = '';
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'สำเร็จ' },
    { value: 'false', label: 'ไม่สำเร็จ' },
  ];

  date1 = ['', ''];
  date2 = ['', ''];
  date3 = ['', ''];
  date4 = ['', ''];

  selectIndex: number[] = [];

  list: RewardHistory[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(
    private router: Router,
    private rewardService: RewardService,
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
    this.date3 = (this.router.routerState.snapshot.root.queryParams[
      'date3'
    ] as []) || ['', ''];
    this.date4 = (this.router.routerState.snapshot.root.queryParams[
      'date4'
    ] as []) || ['', ''];
    this.type = this.router.routerState.snapshot.root.queryParams['type'] || '';
    this.status =
      this.router.routerState.snapshot.root.queryParams['status'] || '';

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

    await this.rewardService.getHistory(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as RewardHistory[];

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
    if (this.type != e.value) {
      this.type = e.value;
      this.page = 1;
      // this.fetch();
    }
  }
  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.page = 1;
      // this.fetch();
    }
  }
  date1Change(e: string[]): void {
    this.date1 = e;
    this.page = 1;
    this.redirect();
  }
  date2Change(e: string[]): void {
    this.date2 = e;
    this.page = 1;
    this.redirect();
  }
  date3Change(e: string[]): void {
    this.date3 = e;
    this.page = 1;
    this.redirect();
  }
  date4Change(e: string[]): void {
    this.date4 = e;
    this.page = 1;
    this.redirect();
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
    this.router.navigate(['/reward-history'], {
      queryParams: {
        page: this.page,
        pageSize: this.pageSize,
        q: this.q,
        type: this.type,
        statu: this.status,
        date1: this.date1,
        date2: this.date2,
        date3: this.date3,
        date4: this.date4,
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
  export1Click(): void {
    this.fetch(1, this.date1, 'reward-history-cashback-exports.csv');
  }
  export2Click(): void {
    this.fetch(2, this.date2, 'reward-history-item-exports.csv');
  }
  export3Click(): void {
    this.fetch(3, this.date3, 'reward-history-point-exports.csv');
  }
  export4Click(): void {
    this.fetch(4, this.date4, 'reward-history-code-exports.csv');
  }

  downloadJSONAsCSV(jsonData: RewardHistory[], filename: string) {
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
  jsonToCsv(jsonData: RewardHistory[]) {
    let csv = '';
    // Get the headers
    let headers = Object.keys(jsonData[0]) as (keyof RewardHistory)[];
    csv += headers.join(',') + '\n';
    // Add the data
    jsonData.forEach((row: RewardHistory) => {
      let data = headers.map((header) => row[header] || '').join(',');
      csv += data + '\n';
    });
    return csv;
  }
}
