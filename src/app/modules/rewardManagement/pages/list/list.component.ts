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
import { Promotion } from 'src/app/core/models/promotion.model';
import { Reward } from 'src/app/core/models/reward.model';
import { RewardService } from 'src/app/core/services/reward.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reward-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  category: Select2Value = '';
  categoryOption: Select2Option[] = [];
  type: Select2Value = '';
  typeOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 1, label: 'ใช้ Point แลก Cashback' },
    { value: 2, label: 'ใช้ Point แลก ของ' },
    {
      value: 3,
      label: 'ใช้ Point แลก Point',
    },
    {
      value: 4,
      label: 'ใช้ Point แลก Code',
    },
  ];
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  list: Reward[] = [];
  categories: Category[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  deleteId = 0;
  alertDeleteId = 0;

  constructor(
    private router: Router,
    private rewardService: RewardService,
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
    this.fetchCategory();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.category)
      params = params.append('categoryId', this.category as string);
    if (this.type) params = params.append('typeId', this.type as string);
    if (this.status) params = params.append('status', this.status as string);

    this.rewardService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Reward[];
      },
      (error) => {
        console.log(error);
      }
    );
    this.rewardService.getListTotal(params).subscribe(
      (response) => {
        this.totalPage = response.data?.totalPage || 1;
      },
      (error) => {}
    );
  }

  fetchCategory(): void {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    this.categoryService.getList(params).subscribe(
      (response) => {
        this.categories = response.data as Category[];
        this.categoryOption.push({ value: '', label: 'ทั้งหมด' });
        this.categoryOption = this.categoryOption.concat(
          this.categories
            .filter((c) => c.isReward)
            .map((c) => {
              return { value: c.id, label: c.name } as Select2Option;
            })
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.fetch();
  }
  categoryChange(e: Select2UpdateEvent): void {
    if (this.category != e.value) {
      this.category = e.value;
      this.fetch();
    }
  }
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;
      this.fetch();
    }
  }
  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.fetch();
    }
  }
  pageChange(p: number): void {
    this.page = p;
    this._location.go(
      `/reward-management?page=${this.page}&pageSize=${this.pageSize}`
    );
    this.fetch();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this._location.go(
      `/reward-management?page=${this.page}&pageSize=${this.pageSize}`
    );
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
    this.rewardService.delete(id).subscribe(
      (response) => {
        // this.router.navigate(['/promotion-management']);
        this.fetch();
      },
      (error) => {
        console.log(error);
        // this.toastService.add('error', error);
        this.toastService.add('error', 'ไม่สามารถทำรายการได้ ');
      }
    );
  }
}
