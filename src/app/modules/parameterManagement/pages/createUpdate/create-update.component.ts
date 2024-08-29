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
import {
  Installment,
  InstallmentPlan,
} from 'src/app/core/models/parameter.model';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-parameter-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการการผ่อนชำระ', to: '/parameter' },
    { title: 'สร้างพารามิเตอร์', to: '' },
  ];
  installmentPlans: InstallmentPlan[] = [];
  installmentPlanOption: Select2Option[] = [];
  installmentPlan: InstallmentPlan = {} as InstallmentPlan;

  mccs: string[] = [];
  cards: Card[] = [];
  cardIds: number[] = [];
  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    planCode: new FormControl(''),
    mccCode: new FormControl<string[]>([]),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    cardId: new FormControl<number[]>([]),
    isActive: new FormControl(false),
  });

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private parameterService: ParameterService,
    private cardService: CardService,
    private toastService: ToastService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'สร้างพารามิเตอร์' : 'แก้ไขพารามิเตอร์';
  }

  async ngOnInit() {
    await this.fetch();
    await this.fetchCards();
    await this.fetchInstallmentPlans();
  }

  async fetch() {
    if (this.id != 'create') {
      await this.parameterService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Installment;
          this.submitForm.setValue({
            name: res.name,
            description: res.description,
            planCode: res.planCode,
            mccCode: res.mccCode,
            startDate: res.startDate,
            endDate: res.endDate,
            cardId: res.cardId,
            isActive: res.isActive,
          });

          this.fetchInstallmentPlan(res.planCode);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  fetchCards(): void {
    let params = new HttpParams();
    this.cardService.getList(params).subscribe(
      (response) => {
        this.cards = response.data as Card[];
        this.cardIds = this.cards.map((c) => c.id);
      },
      (error) => {}
    );
  }

  fetchInstallmentPlans(): void {
    let params = new HttpParams();
    this.parameterService.getInstallmentPlanList(params).subscribe(
      (response) => {
        this.installmentPlans = response.data as InstallmentPlan[];
        this.installmentPlanOption = this.installmentPlans.map((i) => {
          return {
            value: i.name,
            label: i.name,
          } as Select2Option;
        });
      },
      (error) => {}
    );
  }

  onSubmit(): void {
    if (this.id == 'create') {
      this.parameterService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/parameter']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
    } else {
      this.parameterService
        .update(parseInt(this.id), this.submitForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.router.navigate(['/parameter']);
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', error);
          }
        );
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  mccChange(e: string[]): void {
    this.mccs = e;
  }

  updateCard(event: boolean, id: number) {
    if (event)
      this.submitForm
        .get('cardId')
        ?.setValue(this.submitForm.get('cardId')?.value?.concat([id]) || []);
    else {
      const filter = this.submitForm
        .get('cardId')
        ?.value?.filter((c) => c != id);

      this.submitForm.get('cardId')?.setValue(filter || []);
    }
  }

  installmentPlanChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('planCode')?.value != e.value) {
      this.submitForm.get('planCode')?.setValue(e.value as string);

      this.fetchInstallmentPlan(e.value as string);
    }
  }

  async fetchInstallmentPlan(name: string) {
    const f = this.installmentPlans.find((i) => i.name == name);
    if (!f) return;

    const res = await this.parameterService
      .getInstallmentPlan(f?.id || 0)
      .toPromise();
    this.installmentPlan = res?.data as InstallmentPlan;
  }
}
