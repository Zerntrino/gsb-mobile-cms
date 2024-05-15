import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { BannerService } from 'src/app/core/services/banner.service';
import { Banner } from 'src/app/core/models/banner.model';

@Component({
  selector: 'app-banner-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  date = ['', ''];
  list: Banner[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(private router: Router, private bannerService: BannerService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.date[0] && this.date[1]) {
      params = params.append('startDate', this.date[0]);
      params = params.append('endDate', this.date[0]);
    }

    this.bannerService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Banner[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.fetch();
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

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
}
