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

  deleteId = 0;

  constructor(
    private router: Router,
    private newsletterService: NewsLetterService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
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

    this.newsletterService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as NewsLetter[];
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
    this.fetch();
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

  deleteClick(id: number | undefined) {
    this.deleteId = id || 0;
  }
  deleteConfirm(id: number) {
    this.newsletterService.delete(id).subscribe(
      (response) => {
        this.router.navigate(['/newsletter-management']);
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', error);
      }
    );
  }
}
