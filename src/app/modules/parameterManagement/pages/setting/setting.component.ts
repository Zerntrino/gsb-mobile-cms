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
import {
  InstallmentPlan,
  MCC,
  ParameterMCC,
  ParameterMinimum,
} from 'src/app/core/models/parameter.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-parameter-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class ParameterSettingComponent implements OnInit {
  navItems = [
    { title: 'จัดการการผ่อนชำระ', to: '' },
    { title: 'ตั้งค่า', to: '' },
  ];

  tabs = [
    'ตั้งค่า MCC (ห้ามผ่อนชำระ)',
    'ตั้งค่ายอดใช้จ่ายขั้นต่ำ (ต่อเซลล์สลิป)',
  ];
  tab = 0;

  qMcc = '';
  qAddMcc = '';
  statusMcc: Select2Value = '';
  statusMccOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  statusMinimum: Select2Value = '';
  statusMinimumOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  mcc: ParameterMCC = {} as ParameterMCC;
  addMcc: Select2Value = '';
  addMccOption: Select2Option[] = [];
  currentAddMccOption: Select2Option[] = [];

  mccs: MCC[] = [];
  listMcc: ParameterMCC[] = [];
  listMinimum: ParameterMinimum[] = [];

  showType = 'hide';

  constructor(
    private router: Router,
    private parameterService: ParameterService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.parameterService.getMCCList().subscribe(
      (response) => {
        this.mccs = response.data as MCC[];
        this.addMccOption = this.mccs.map((item) => {
          return {
            value: item.code,
            label: `${item.code} : ${item.name}`,
          } as Select2Option;
        });
      },
      (error) => {
        console.log(error);
      }
    );

    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams();
    if (this.qMcc) params = params.append('find', this.qMcc);
    if (this.statusMcc)
      params = params.append('status', this.statusMcc.toString());
    this.parameterService.getInstallmentMCCList(params).subscribe(
      (response) => {
        this.listMcc = (response.data as ParameterMCC[]).map((e) => {
          e.mccCode = e.mccCode.map((i) => i.split(':').at(0)?.trim() || '');
          return e;
        });
      },
      (error) => {
        console.log(error);
      }
    );

    let params2 = new HttpParams();
    if (this.statusMinimum)
      params2 = params2.append('status', this.statusMinimum.toString());
    this.parameterService.getInstallmentMinimumList(params2).subscribe(
      (response) => {
        this.listMinimum = response.data as ParameterMinimum[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qMccChange(): void {
    this.fetch();
  }
  statusMccChange(e: Select2UpdateEvent): void {
    if (this.statusMcc != e.value) {
      this.statusMcc = e.value;
      this.fetch();
    }
  }
  qMinimumChange(): void {
    this.fetch();
  }

  statusMinimumChange(e: Select2UpdateEvent): void {
    if (this.statusMcc != e.value) {
      this.statusMcc = e.value;
      this.fetch();
    }
  }

  addMccChange(e: Select2UpdateEvent): void {
    if (e.value && this.addMcc != e.value) {
      this.mcc.mccCode?.push(e.value as string);

      e.component.value = '';
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  pull(ar: number[], i: number): number[] {
    return pull(ar, i);
  }

  getMccName(a: string): string {
    return this.addMccOption.find((m) => m.value == a)?.label || '';
  }
  show(d: ParameterMCC): void {
    this.mcc = JSON.parse(JSON.stringify(d));
    console.log(this.mcc.mccCode);
    this.currentAddMccOption = this.addMccOption.filter(
      (m) => !this.mcc.mccCode.includes(m.value as string)
    );
    this.showType = 'show';
  }
  remove(item: string): void {
    this.mcc.mccCode = this.mcc.mccCode.filter((i) => i != item);
  }
  confirm(): void {
    const index = this.listMcc.findIndex((i) => i.id == this.mcc.id);
    this.listMcc[index] = this.mcc;
    this.showType = 'hide';
  }

  async save() {
    if (this.tab == 0) {
      await this.listMcc.forEach(async (item) => {
        console.log(item);
        this.updateInstallmentMCC(item);
      });

      this.toastService.add(
        'success',
        'บันทึก ตั้งค่า MCC (ห้ามผ่อนชำระ) เรียบร้อยแล้ว'
      );
    } else {
      await this.listMinimum.forEach((item) => {
        this.updateMinimum(item);
      });

      this.toastService.add(
        'success',
        'บันทึก ตั้งค่ายอดใช้จ่ายขั้นต่ำ (ต่อเซลล์สลิป) เรียบร้อยแล้ว'
      );
    }
  }

  async updateInstallmentMCC(item: ParameterMCC) {
    await this.parameterService
      .updateInstallmentMCC(item.id, { mccCode: item.mccCode })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  editMinimum(item: ParameterMinimum): void {
    item.isEditing = true;
    item.oldMinimumAmount = item.minimumAmount;
  }

  async updateMinimum(item: ParameterMinimum) {
    item.isEditing = false;

    await this.parameterService
      .updateInstallmentMinimum(item.id, item.minimumAmount)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
