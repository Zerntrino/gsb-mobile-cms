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
import { ParameterService } from 'src/app/core/services/parameter.service';
import { InstallmentPlan, Plan } from 'src/app/core/models/parameter.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';

@Component({
  selector: 'app-installment-plan-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class InstallmentPlanListComponent implements OnInit {
  navItems = [
    { title: 'จัดการการผ่อนชำระ', to: '/parameter' },
    { title: 'Installment Plan', to: '' },
  ];

  q = '';
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  month: Select2Value = '';
  monthOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
    { value: '20', label: '20' },
    { value: '21', label: '21' },
    { value: '22', label: '22' },
    { value: '23', label: '23' },
    { value: '24', label: '24' },
  ];

  list: InstallmentPlan[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  deleteId = 0;
  alertDeleteId = 0;

  plan = { isAbroad: true } as InstallmentPlan;

  showType = 'hide';
  mode = 'edit';

  constructor(
    private router: Router,
    private parameterService: ParameterService,
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
    this.q = this.router.routerState.snapshot.root.queryParams['q'] || '';
    this.status =
      this.router.routerState.snapshot.root.queryParams['status'] || '';
    this.month =
      this.router.routerState.snapshot.root.queryParams['month'] || '';

    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.status) params = params.append('status', this.status as string);
    if (this.month) params = params.append('month', this.month as string);

    this.parameterService.getInstallmentPlanList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as InstallmentPlan[];
      },
      (error) => {
        console.log(error);
      }
    );
    this.parameterService.getInstallmentPlanListTotal(params).subscribe(
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

  monthChange(e: Select2UpdateEvent): void {
    if (this.month != e.value && e.value != undefined) {
      this.month = e.value;
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
    this.router.navigate(['/parameter/installment-plan'], {
      queryParams: {
        page: this.page,
        pageSize: this.pageSize,
        q: this.q,
        status: this.status,
        month: this.month,
      },
    });
    this.fetch();
  }
  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  pull(ar: number[], i: number): number[] {
    return pull(ar, i);
  }

  createPlanClick(d?: InstallmentPlan): void {
    this.showType = 'show';
    this.plan = JSON.parse(
      JSON.stringify(
        d || {
          planInstallment: [],
          isAbroad: true,
        }
      )
    );
  }
  editClick(d: InstallmentPlan): void {
    this.mode = 'edit';
    this.showType = 'show';
    this.parameterService.getInstallmentPlan(d.id).subscribe(
      (response) => {
        this.plan = response.data as InstallmentPlan; // JSON.parse(JSON.stringify(d || { planInstallment: [] }));
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
      }
    );
  }

  viewClick(d: InstallmentPlan): void {
    this.mode = 'view';
    this.showType = 'show';
    this.parameterService.getInstallmentPlan(d.id).subscribe(
      (response) => {
        this.plan = response.data as InstallmentPlan; // JSON.parse(JSON.stringify(d || { planInstallment: [] }));
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
      }
    );
  }

  checkRequire(): boolean {
    return !(
      this.plan.name &&
      this.plan.planInstallment.reduce(
        (a, b) =>
          !!(
            a &&
            b.interestRate >= 0 &&
            b.month &&
            b.expensesMinimumInstallment >= 0
          ),
        true
      )
    );
  }

  editItemClick(): void {
    this.mode = 'edit';
    this.showType = 'show';
  }

  addPlan() {
    this.plan.planInstallment.push({} as Plan);
  }
  removePlan(i: number) {
    this.plan.planInstallment = this.plan.planInstallment.filter(
      (d, index) => index != i
    );
  }
  confirmClick(): void {
    if (this.plan.id) {
      this.parameterService
        .updateInstallmentPlan(this.plan.id, this.plan)
        .subscribe(
          (response) => {
            this.showType = 'hide';
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.fetch();
          },
          (error) => {
            console.log(error);
            // this.toastService.add('error', error);
            this.toastService.add('error', 'ไม่สามารถทำรายการได้ ');
          }
        );
    } else {
      this.parameterService.createInstallmentPlan(this.plan).subscribe(
        (response) => {
          this.showType = 'hide';
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.fetch();
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
        }
      );
    }
  }

  deleteClick(id: number | undefined, active: boolean) {
    if (active) this.alertDeleteId = id || 0;
    else this.deleteId = id || 0;
  }
  deleteConfirm(id: number) {
    this.parameterService.deleteInstallmentPlan(id).subscribe(
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
