import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PromotionService } from 'src/app/core/services/promotion.service';
import { Promotion } from 'src/app/core/models/promotion.model';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import { Reward } from 'src/app/core/models/reward.model';
import { RewardService } from 'src/app/core/services/reward.service';
import { CardService } from 'src/app/core/services/card.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Card } from 'src/app/core/models/card.model';

@Component({
  selector: 'app-reward-management-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit {
  navItems = [
    {
      title: 'จัดการรีวอร์ด/เลือกไฮไลท์ : รีวอร์ด',
      to: '/reward-management',
    },
    { title: 'จัดการไฮไลท์ : รีวอร์ด', to: '' },
  ];

  list: Reward[] = [];
  rewards: Reward[] = [];
  rewardsAll: Reward[] = [];
  showSelected = false;
  q = '';

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

  card: Select2Value = '';
  cardOption: Select2Option[] = [];

  constructor(
    private router: Router,
    private rewardService: RewardService,
    private cardService: CardService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    await this.fetchCard();
    // await this.fetch();
  }

  async fetchRewards() {
    let params = new HttpParams()
      .append('page', 1)
      .append('pageSize', 100)
      .append('cardId', this.card as string);
    if (this.q) params = params.append('find', this.q);
    params = params.append('cardId', this.card as string);
    await this.rewardService.getList(params).subscribe(
      (response) => {
        this.rewardsAll = response.data as Reward[];
        const useds = this.list.map((l) => l.id);
        this.rewards = this.rewardsAll.filter(
          (p) => p.isActive && !useds.includes(p.id)
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async fetch() {
    await this.rewardService.getHighlights(this.card as string).subscribe(
      (response) => {
        this.list = response.data as Reward[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async fetchCard() {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    await this.cardService.getList(params).subscribe(
      (response) => {
        const cards = response.data as Card[];
        this.cardOption = cards
          .filter((c) => c.isActive)
          .map((c) => {
            return { value: `${c.id}`, label: c.name } as Select2Option;
          });
        this.card = `${cards[0]?.id}`;

        this.fetch();
        this.fetchRewards();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    console.log(this.list);
  }
  cardChange(e: Select2UpdateEvent): void {
    if (this.card != e.value) {
      this.card = e.value;
      this.fetch();
      this.fetchRewards();
    }
  }

  async qChange() {
    await this.fetchRewards();
  }
  show(): void {
    const useds = this.list.map((l) => l.id);
    this.rewards = this.rewardsAll.filter(
      (p) => p.isActive && !useds.includes(p.id)
    );

    this.showSelected = true;
  }
  delete(index: number): void {
    this.list = this.list.filter((l, i) => index != i);
  }
  selectedClick(): void {
    const selects = this.rewards.filter((p) => p.select);
    this.list = this.list.concat(selects);
    this.showSelected = false;
  }

  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;

      const useds = this.list.map((l) => l.id);
      this.rewards = this.rewardsAll.filter(
        (p) =>
          p.isActive &&
          !useds.includes(p.id) &&
          (!this.type || p.typeId == this.type)
      );
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  submitClick() {
    this.rewardService
      .updateHighlights({
        cardId: parseInt(this.card as string) || 0,
        rewardId: this.list.map((l) => l.id),
      })
      .subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.fetch();
          // this.router.navigate(['/reward-management/highlight']);
        },
        (error) => {
          console.log(error);
          // this.toastService.add('error', error);
          this.toastService.add('error', 'ไม่สามารถทำรายการได้ ');
        }
      );
  }
}
