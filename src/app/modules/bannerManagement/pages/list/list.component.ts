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
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';

@Component({
  selector: 'app-banner-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  list: Banner[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  deleteId = 0;
  alertDeleteId = 0;

  constructor(
    private router: Router,
    private bannerService: BannerService,
    private toastService: ToastService,
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
    this.q = this.router.routerState.snapshot.root.queryParams['q'];
    this.status = this.router.routerState.snapshot.root.queryParams['status'];

    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.status) params = params.append('status', this.status as string);

    this.bannerService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Banner[];
      },
      (error) => {
        console.log(error);
      }
    );
    this.bannerService.getListTotal(params).subscribe(
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
  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value && e.value != undefined) {
      this.status = e.value;
      this.page = 1;
      this.redirect();
    }
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
    this.router.navigate(['/banner-management'], {
      queryParams: {
        page: this.page,
        pageSize: this.pageSize,
        q: this.q,
        status: this.status,
      },
    });

    this.fetch();
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  deleteClick(id: number | undefined, active: boolean) {
    if (active) this.alertDeleteId = id || 0;
    else this.deleteId = id || 0;
  }
  deleteConfirm(id: number) {
    this.bannerService.delete(id).subscribe(
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
