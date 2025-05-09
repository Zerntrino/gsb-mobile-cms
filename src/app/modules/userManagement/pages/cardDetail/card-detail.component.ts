import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { NavItem } from 'src/app/modules/shared/components/nav/nav.component';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import {
  CardPomition,
  CardReward,
  CreditCardList,
  User,
} from 'src/app/core/models/user.model';
import dayjs from 'dayjs';
import { HttpParams } from '@angular/common/http';
import { Card } from 'src/app/core/models/card.model';

@Component({
  selector: 'app-user-management-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  id: string = '';
  card: string = '';
  navItems = [
    { title: 'จัดการผู้ใช้บัตร', to: '/user-management' },
    { title: 'ข้อมูลผู้ใช้บัตร', to: '/user-management/' },
    { title: 'บัตรเครดิต', to: '' },
  ];
  tabs = ['ประวัติการแลกคะแนน', 'ประวัติการใช้โปรโมชัน'];
  tab = 0;

  rewards: CardReward[] = [];
  promotions: CardPomition[] = [];

  page1 = 1;
  pageSize1 = 10;
  totalPage1 = 1;

  page2 = 1;
  pageSize2 = 10;
  totalPage2 = 1;

  user = {} as User;
  cardS = {} as CreditCardList;
  ref = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.card = this.activatedRoute.snapshot.params['card'];
    this.navItems[1].to = '/user-management/' + this.id;

    // this.userService.getUserProfile(this.id).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  async fetch() {
    console.log(this.card);
    const res = await this.userService.getUser(this.id);
    if (res instanceof Error) {
      console.log(res);
    } else {
      this.user = (res?.data || {}) as User;
      this.cardS = (this.user.creditCardList.find(
        (c) => c.accountNumber == this.card
      ) || {}) as CreditCardList;

      this.ref = this.getRef(
        this.cardS.accountNumber,
        this.cardS.cardOrg,
        this.cardS.cardNumber
      );
    }
  }

  async fetchReward() {
    let params = new HttpParams()
      .append('page', this.page1)
      .append('pageSize', this.pageSize1);
    const res = await this.userService.getRewardHistory(
      this.id,
      this.ref,
      params
    );
    if (res instanceof Error) {
      console.log(res);
    } else {
      console.log(res);
      this.rewards = res?.data || [];
    }

    const res2 = await this.userService.getRewardHistoryTotalPage(
      this.id,
      this.ref,
      params
    );
    if (res2 instanceof Error) {
      console.log(res2);
    } else {
      console.log(res2);
      this.totalPage1 = res2?.data?.totalPage || 1;
    }
  }
  async fetchPromotion() {
    let params = new HttpParams()
      .append('page', this.page2)
      .append('pageSize', this.pageSize2);
    const res = await this.userService.getPromotionHistory(
      this.id,
      this.ref,
      params
    );
    if (res instanceof Error) {
      console.log(res);
    } else {
      this.promotions = res?.data || [];
    }

    const res2 = await this.userService.getPromotionHistoryTotalPage(
      this.id,
      this.ref,
      params
    );
    if (res2 instanceof Error) {
      console.log(res2);
    } else {
      console.log(res2);
      this.totalPage2 = res2?.data?.totalPage || 1;
    }
  }

  async ngOnInit() {
    console.log('init');
    await this.fetch();

    this.fetchReward();
    this.fetchPromotion();
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  pageChange1(p: number): void {
    this.page1 = p;
    this.fetchReward();
  }
  pageSizeChange1(s: number): void {
    this.pageSize1 = s;
    this.fetchReward();
  }

  pageChange2(p: number): void {
    this.page2 = p;
    this.fetchPromotion();
  }
  pageSizeChange2(s: number): void {
    this.pageSize2 = s;
    this.fetchPromotion();
  }

  getRef(accountNumber: string, cardOrg: string, cardNumber: string) {
    const referenceId = `${this.id.slice(
      this.id.length - 4
    )}${accountNumber.slice(0, 5)}${(
      (cardOrg == '001' ? '100' : '800') + this.id
    ).slice(0, 12)}${cardNumber.slice(12)}`;
    return `${referenceId}`;
  }
}
