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
    {
      value: '',
      label: 'ทั้งหมด',
    },
  ];
  statusMinimum: Select2Value = '';
  statusMinimumOption: Select2Option[] = [
    {
      value: '',
      label: 'ทั้งหมด',
    },
  ];
  mcc: ParameterMCC = {} as ParameterMCC;
  addMcc: Select2Value = '';
  addMccOption: Select2Option[] = [];

  mccs: MCC[] = [];
  listMcc: ParameterMCC[] = [];
  listMinimum: ParameterMinimum[] = [];

  showType = 'hide';

  constructor(
    private router: Router,
    private parameterService: ParameterService
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
        this.listMcc = response.data as ParameterMCC[];
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
      this.mcc.mccCode?.push(
        `${this.addMccOption.find((i) => i.value == e.value)?.label}`
      );

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

  show(d: ParameterMCC): void {
    this.mcc = JSON.parse(JSON.stringify(d));
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

  save(): void {
    this.parameterService.updateInstallmentMCC(this.mcc?.id || 0, {
      mccCode: this.mcc,
    });
  }

  editMinimum(i: number, item: ParameterMinimum): void {
    item.isEditing = true;
  }

  editedMinimum(i: number, item: ParameterMinimum): void {
    item.isEditing = false;

    this.parameterService
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
