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

  list: InstallmentPlan[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  deleteId = 0;
  alertDeleteId = 0;

  plan = {} as InstallmentPlan;

  showType = 'hide';
  mode = 'edit';

  constructor(
    private router: Router,
    private parameterService: ParameterService,
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
    if (this.status) params = params.append('status', this.status as string);

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
    this.fetch();
  }

  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.fetch();
    }
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
  pull(ar: number[], i: number): number[] {
    return pull(ar, i);
  }

  createPlanClick(d?: InstallmentPlan): void {
    this.showType = 'show';
    this.plan = JSON.parse(
      JSON.stringify(
        d || {
          planInstallment: [],
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
        this.toastService.add('error', error);
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
        this.toastService.add('error', error);
      }
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
            this.toastService.add('error', error);
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
          this.toastService.add('error', error);
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
        this.toastService.add('error', error);
      }
    );
  }
}
