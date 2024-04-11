import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import { Ad } from 'src/app/core/models/ad.model';
import { AdService } from 'src/app/core/services/ad.service';
import dayjs from 'dayjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-parameter-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการการผ่อนชำระ', to: '' },
    { title: 'สร้างพารามิเตอร์', to: '' },
  ];

  installmentPlan: Select2Value = '';
  installmentPlanOption: Select2Option[] = [];

  dt1 = '';
  dt2 = '';

  mccs: string[] = [];

  constructor(private router: Router, activatedRoute: ActivatedRoute) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'สร้างพารามิเตอร์' : 'แก้ไขพารามิเตอร์';
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {}

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  mccChange(e: string[]): void {
    this.mccs = e;
  }

  installmentPlanChange(e: Select2UpdateEvent): void {
    if (this.installmentPlan != e.value) {
      this.installmentPlan = e.value;
    }
  }
}
