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
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/models/card.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-parameter-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class ParameterSettingComponent implements OnInit {
  roleEditable = [1, 2].includes(this.authService.getRole() || 0);
  navItems = [
    { title: 'จัดการการผ่อนชำระ', to: '/parameter' },
    { title: 'ตั้งค่า', to: '' },
  ];

  tabs = [
    'ตั้งค่า MCC (ห้ามผ่อนชำระ)',
    'ตั้งค่ายอดใช้จ่ายขั้นต่ำ (ต่อเซลล์สลิป)',
  ];
  tab = 0;

  qMcc = '';
  qAddMcc = '';
  type: Select2Value = '';
  typeOption: Select2Option[] = [{ value: '', label: 'ทั้งหมด' }];
  typeMinimum: Select2Value = '';
  typeMinimumOption: Select2Option[] = [{ value: '', label: 'ทั้งหมด' }];
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
    private cardService: CardService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchMCC();

    this.fetch();
  }

  fetchMCC(): void {
    let params = new HttpParams();
    params = params.append('pageSize', '1000');
    this.parameterService.getMCCList(params).subscribe(
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
  }

  fetch(): void {
    let params1 = new HttpParams();
    params1 = params1.append('pageSize', '1000');
    this.cardService.getList(params1).subscribe((response) => {
      this.typeOption = [{ value: '', label: 'ทั้งหมด' }];
      this.typeMinimumOption = [{ value: '', label: 'ทั้งหมด' }];
      const cards = response.data as Card[];
      cards.map((item: Card) => {
        this.typeOption.push({ value: item.id, label: item.name });
        this.typeMinimumOption.push({ value: item.id, label: item.name });
      });
    });

    let params = new HttpParams();
    params = params.append('pageSize', '1000');
    if (this.qMcc) params = params.append('find', this.qMcc);
    if (this.type) params = params.append('card', this.type.toString());
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
    params2 = params2.append('pageSize', '1000');
    if (this.typeMinimum)
      params2 = params2.append('card', this.typeMinimum.toString());
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
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value && e.value != undefined) {
      this.type = e.value;
      this.fetch();
    }
  }
  qMinimumChange(): void {
    this.fetch();
  }

  typeMinimumChange(e: Select2UpdateEvent): void {
    if (this.typeMinimum != e.value) {
      this.typeMinimum = e.value;
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

    this.updateInstallmentMCC(this.listMcc[index]);
  }

  // async save() {
  //   if (this.tab == 0) {
  //     await this.listMcc.forEach(async (item) => {
  //       console.log(item);
  //       this.updateInstallmentMCC(item);
  //     });

  //     this.toastService.add(
  //       'success',
  //       'บันทึก ตั้งค่า MCC (ห้ามผ่อนชำระ) เรียบร้อยแล้ว'
  //     );
  //   } else {
  //     await this.listMinimum.forEach((item) => {
  //       this.updateMinimum(item);
  //     });

  //     this.toastService.add(
  //       'success',
  //       'บันทึก ตั้งค่ายอดใช้จ่ายขั้นต่ำ (ต่อเซลล์สลิป) เรียบร้อยแล้ว'
  //     );
  //   }
  // }

  async updateInstallmentMCC(item: ParameterMCC) {
    await this.parameterService
      .updateInstallmentMCC(item.id, { mccCode: item.mccCode })
      .subscribe(
        (response) => {
          console.log(response);
          this.toastService.add(
            'success',
            'บันทึก ตั้งค่า MCC (ห้ามผ่อนชำระ) เรียบร้อยแล้ว'
          );
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
          this.toastService.add(
            'success',
            'บันทึก ตั้งค่ายอดใช้จ่ายขั้นต่ำ (ต่อเซลล์สลิป) เรียบร้อยแล้ว'
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
