import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category-management-list',
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
  apply: Select2Value = '';
  applyOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'isPromotion', label: 'โปรโมชั่น' },
    { value: 'isReward', label: 'รีวอร์ด' },
  ];
  list: Category[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  deleteId = 0;
  alertDeleteId = 0;

  showDetail = -1;
  showDetailMode = 'edit';
  detail?: Category;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
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

    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.status) params = params.append('status', this.status as string);
    if (this.apply == 'isPromotion') {
      this.categoryService.getListPromotion(params).subscribe(
        (response) => {
          console.log(response.data);
          this.list = response.data as Category[];
        },
        (error) => {
          console.log(error);
        }
      );
      this.categoryService.getListPromotionTotal(params).subscribe(
        (response) => {
          this.totalPage = response.data?.totalPage || 1;
        },
        (error) => {}
      );
    } else if (this.apply == 'isReward') {
      this.categoryService.getListReward(params).subscribe(
        (response) => {
          console.log(response.data);
          this.list = response.data as Category[];
        },
        (error) => {
          console.log(error);
        }
      );
      this.categoryService.getListRewardTotal(params).subscribe(
        (response) => {
          this.totalPage = response.data?.totalPage || 1;
        },
        (error) => {}
      );
    } else {
      this.categoryService.getList(params).subscribe(
        (response) => {
          console.log(response.data);
          this.list = response.data as Category[];
        },
        (error) => {
          console.log(error);
        }
      );
      this.categoryService.getListTotal(params).subscribe(
        (response) => {
          this.totalPage = response.data?.totalPage || 1;
        },
        (error) => {}
      );
    }
  }

  qChange(): void {
    this.fetch();
  }
  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.fetch();
    }
  }
  applyChange(e: Select2UpdateEvent): void {
    if (this.apply != e.value) {
      this.apply = e.value;
      this.fetch();
    }
  }
  pageChange(p: number): void {
    this.page = p;
    this._location.go(
      `/category-management?page=${this.page}&pageSize=${this.pageSize}`
    );
    this.fetch();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this._location.go(
      `/category-management?page=${this.page}&pageSize=${this.pageSize}`
    );
    this.fetch();
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  createClick(): void {
    this.showDetail = 0;
  }
  showDetailClick(item: Category, edit: boolean) {
    this.detail = item;
    this.showDetail = item.id || 0;
    if (edit) this.showDetailMode = 'edit';
    else this.showDetailMode = 'view';
  }
  showDetailSuccess() {
    this.fetch();
    this.showDetail = -1;
  }

  deleteClick(id: number | undefined, active: boolean) {
    if (active) this.alertDeleteId = id || 0;
    else this.deleteId = id || 0;
  }
  deleteConfirm(id: number) {
    this.categoryService.delete(id).subscribe(
      (response) => {
        this.fetch();
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
      }
    );
  }
  joinComma(items: string[]): string {
    return items.filter((item) => item).join(', ');
  }
}
