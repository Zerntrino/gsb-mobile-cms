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
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/models/card.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-promotion-management-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit {
  navItems = [
    { title: 'จัดการโปรโมชัน', to: '' },
    { title: 'เลือกไฮไลท์ : โปรโมชัน', to: '' },
  ];

  list: Promotion[] = [];
  promotions: Promotion[] = [];
  showSelected = false;
  q = '';

  card: Select2Value = '';
  cardOption: Select2Option[] = [];

  constructor(
    private router: Router,
    private promotionService: PromotionService,
    private cardService: CardService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    await this.fetchCard();
    // await this.fetch();
    await this.fetchPromotions();
  }

  async fetch() {
    if (!this.card) return;
    await this.promotionService.getHighlights(this.card as string).subscribe(
      (response) => {
        this.list = response.data as Promotion[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async fetchPromotions() {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    if (this.q) params = params.append('find', this.q);
    await this.promotionService.getList(params).subscribe(
      (response) => {
        this.promotions = response.data as Promotion[];
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
        this.cardOption = cards.map((c) => {
          return { value: `${c.id}`, label: c.name } as Select2Option;
        });
        this.card = `${cards[0]?.id}`;

        this.fetch();
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

  qChange(): void {
    this.fetchPromotions();
  }
  cardChange(e: Select2UpdateEvent): void {
    if (this.card != e.value) {
      this.card = e.value;
      this.fetch();
    }
  }
  show(): void {
    const useds = this.list.map((l) => l.id);
    this.promotions = this.promotions.filter((p) => !useds.includes(p.id));

    this.showSelected = true;
  }
  delete(index: number): void {
    this.list = this.list.filter((l, i) => index != i);
  }
  selectedClick(): void {
    const selects = this.promotions.filter((p) => p.select);
    this.list = this.list.concat(selects);
    this.showSelected = false;
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  submitClick() {
    console.log('submitClick');
    this.promotionService
      .updateHighlights(this.card as string, {
        promotionId: this.list.map((l) => l.id),
      })
      .subscribe(
        (response) => {
          this.router.navigate(['/promotion-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
  }
}
