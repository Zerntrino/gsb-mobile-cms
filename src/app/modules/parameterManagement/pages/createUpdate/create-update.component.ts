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
  MCC,
  ParameterMinimum,
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
  mode = 'edit';
  installmentPlans: InstallmentPlan[] = [];
  installmentPlanOption: Select2Option[] = [];
  installmentPlan: InstallmentPlan = {} as InstallmentPlan;
  listMinimum: ParameterMinimum[] = [];

  mccOption: Select2Option[] = [];
  cards: Card[] = [];
  cardIds: number[] = [];
  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    planId: new FormControl(0, [Validators.required]),
    planCode: new FormControl('', []),
    mccCode: new FormControl<string[]>([]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    cardId: new FormControl<number[]>([], [Validators.required]),
    isActive: new FormControl(false),
  });

  currentDate = new Date(
    new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0)
  ).toISOString();

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

    activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'view') {
        this.mode = 'view';
        this.submitForm.disable();
      }

      this.navItems[1].title =
        this.id == 'create'
          ? 'สร้างพารามิเตอร์'
          : this.mode == 'view'
          ? 'รายละเอียดพารามิเตอร์'
          : 'แก้ไขพารามิเตอร์';
    });
  }

  async ngOnInit() {
    await this.fetchMcc();
  }

  async fetch() {
    if (this.id != 'create') {
      await this.parameterService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Installment;
          const planId = this.installmentPlanOption
            .find((i) => i.label == res.planCode)
            ?.value.toString();

          this.submitForm.setValue({
            name: res.name,
            description: res.description,
            planId: res.planId || parseInt(planId || ''),
            planCode: res.planCode,
            mccCode: res.mccCode,
            startDate: res.startDate,
            endDate: res.endDate,
            cardId: res.cardId,
            isActive: res.isActive,
          });

          this.fetchInstallmentPlan(res.planId);

          return;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async fetchCards() {
    let params = new HttpParams();
    await this.cardService.getList(params).subscribe(
      (response) => {
        const cards = response.data as Card[];
        this.cards = cards.filter((c) => c.isActive);
        this.cardIds = this.cards.map((c) => c.id);

        return;
      },
      (error) => {}
    );
  }

  async fetchInstallmentPlans() {
    let params = new HttpParams();
    await this.parameterService.getInstallmentPlanList(params).subscribe(
      (response) => {
        this.installmentPlans = response.data as InstallmentPlan[];
        this.installmentPlanOption = this.installmentPlans
          .filter((i) => i.isActive)
          .map((i) => {
            return {
              value: i.id,
              label: i.name,
            } as Select2Option;
          });
        return;
      },
      (error) => {}
    );
  }

  async fetchMcc() {
    let params = new HttpParams();
    params = params.append('pageSize', '1000');
    await this.parameterService.getMCCList(params).subscribe(
      (response) => {
        const mccs = response.data as MCC[];
        this.mccOption = mccs.map((item) => {
          return {
            value: item.code,
            label: `${item.code} : ${item.name}`,
          } as Select2Option;
        });

        this.fetchCards();
        this.fetchInstallmentPlans();

        this.fetch();
        setTimeout(() => {
          this.fetchCardMin();
        }, 200);

        return;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async fetchCardMin() {
    let params = new HttpParams();
    params = params.append('pageSize', '1000');
    await this.parameterService.getInstallmentMinimumList(params).subscribe(
      (response) => {
        console.log(this.cardIds);
        this.listMinimum = (response.data as ParameterMinimum[]).filter((c) =>
          this.cardIds.includes(c.cardId)
        );

        return;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCardName(id: number): string {
    const card = this.cards.find((c) => c.id == id);
    return card ? card.name : '';
  }
  getCardMin(id: number): number {
    const min = this.listMinimum.find((c) => c.cardId == id);
    return min ? min.minimumAmount : 0;
  }

  onSubmit(): void {
    const planCode =
      this.installmentPlanOption.find(
        (i) => i.value == this.submitForm.get('planId')?.value
      )?.label || '';
    this.submitForm.setValue({
      ...this.submitForm.getRawValue(),
      planCode: planCode,
    });
    if (this.id == 'create') {
      this.parameterService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/parameter']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
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
            this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
          }
        );
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  mccChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('mccCode')?.value != e.value) {
      this.submitForm.get('mccCode')?.setValue((e.value as string[]) || []);
    }
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
    if (e.value != undefined) {
      this.submitForm.get('planId')?.setValue(e.value as number);

      this.fetchInstallmentPlan(e.value as number);
    }
  }

  async fetchInstallmentPlan(id: number) {
    const f = this.installmentPlans.find((i) => i.id == id);
    if (!f) return;

    const res = await this.parameterService
      .getInstallmentPlan(f?.id || 0)
      .toPromise();
    this.installmentPlan = res?.data as InstallmentPlan;
  }

  edit() {
    this.mode = 'edit';
    this.submitForm.enable();
    this.navItems[1].title = 'แก้ไขพารามิเตอร์';
  }

  dateBeforeNow(d: string | null | undefined): boolean {
    const date = dayjs(d);
    const c = dayjs(this.currentDate);
    const diff = date.diff(c, 'minute');
    return diff <= 0;
  }

  startDateFilter(e: Date | null): boolean {
    const date = dayjs(e);
    const c = dayjs();
    const diff = date.diff(c, 'day');
    return diff >= 0;
  }

  endDateFilter = (e: Date | null): boolean => {
    const date = dayjs(e);
    var c = dayjs();
    var diff = 0;
    if (this.submitForm?.get('startDate')?.value) {
      c = dayjs(this.submitForm.get('startDate')?.value);
      diff = date.diff(c, 'day');
    } else {
      diff = date.diff(c, 'day');
    }
    return diff >= 0;
  };
}
