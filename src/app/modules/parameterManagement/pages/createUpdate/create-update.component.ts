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
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/models/card.model';
import { Installment } from 'src/app/core/models/parameter.model';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  cards: Card[] = [];
  dataForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private parameterService: ParameterService,
    private cardService: CardService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'สร้างพารามิเตอร์' : 'แก้ไขพารามิเตอร์';
  }

  ngOnInit(): void {
    this.fetch();
    this.fetchCards();
  }

  fetch(): void {
    if (this.id != 'create') {
      this.parameterService.get(this.id).subscribe(
        (response) => {
          const data = response.data;
          this.dataForm.get('name')?.setValue(data?.name || '');
        },
        (error) => {}
      );
    }
  }

  fetchCards(): void {
    let params = new HttpParams();
    this.cardService.getList(params).subscribe(
      (response) => {
        this.cards = response.data as Card[];
      },
      (error) => {}
    );
  }

  onSubmit(): void {
    this.parameterService
      .create({
        name: this.dataForm.get('name')?.value,
        description: this.dataForm.get('description')?.value,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {}
      );
  }

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
