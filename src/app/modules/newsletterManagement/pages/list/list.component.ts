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
import { ToastService } from 'src/app/core/services/toast.service';
import { NewsLetterService } from 'src/app/core/services/newsletter.service';
import { NewsLetter } from 'src/app/core/models/newsletter.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-banner-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  date = ['', ''];
  list: NewsLetter[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];

  deleteId = 0;

  constructor(
    private router: Router,
    private newsletterService: NewsLetterService,
    private toastService: ToastService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.page = Number(
      this.router.routerState.snapshot.root.queryParams['page'] || 1
    );
    this.pageSize = Number(
      this.router.routerState.snapshot.root.queryParams['pageSize'] || 10
    );
    this.q = this.router.routerState.snapshot.root.queryParams['q'] || '';
    this.date = (this.router.routerState.snapshot.root.queryParams[
      'date'
    ] as []) || ['', ''];
    this.status =
      this.router.routerState.snapshot.root.queryParams['status'] || '';

    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.date[0] && this.date[1]) {
      params = params
        .append('startDate', dayjs(this.date[0]).format('YYYY-MM-DDT00:00:00'))
        .append('endDate', dayjs(this.date[1]).format('YYYY-MM-DDT00:00:00'));
    }
    if (this.status) params = params.append('status', this.status as string);

    this.newsletterService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as NewsLetter[];
      },
      (error) => {
        console.log(error);
      }
    );
    this.newsletterService.getListTotal(params).subscribe(
      (response) => {
        this.totalPage = response.data?.totalPage || 1;
      },
      (error) => {}
    );
  }

  qChange(): void {
    this.page = 1;
    this.redirect();
  }
  dateChange(e: string[]): void {
    this.date = e;
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
  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.page = 1;
      this.redirect();
    }
  }

  redirect() {
    this._location.go(
      `/newsletter-management?page=${this.page}&pageSize=${this.pageSize}&q=${this.q}&date[0]=${this.date[0]}&date[1]=${this.date[1]}&status=${this.status}`
    );
    this.fetch();
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  timeFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('HH:mm');
  }

  deleteClick(id: number | undefined) {
    this.deleteId = id || 0;
  }
  deleteConfirm(id: number) {
    this.newsletterService.delete(id).subscribe(
      (response) => {
        this.fetch();
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
      }
    );
  }
}
