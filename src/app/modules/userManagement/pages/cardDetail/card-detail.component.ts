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

@Component({
  selector: 'app-user-management-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  id: string = '';
  navItems = [
    { title: 'จัดการผู้ใช้บัตร', to: '/user-management' },
    { title: 'ข้อมูลผู้ใช้บัตร', to: '/user-management/' },
    { title: 'บัตรเครดิต', to: '' },
  ];
  tabs = ['ประวัติการแลกคะแนน', 'ประวัติการใช้โปรโมชัน'];
  tab = 0;

  page1 = 1;
  pageSize1 = 10;
  totalPage1 = 1;

  page2 = 1;
  pageSize2 = 10;
  totalPage2 = 1;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
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

  fetch(): void {
    // let params = new HttpParams()
    //   .append('page', this.page)
    //   .append('pageSize', this.pageSize);
    // if (this.q) params = params.append('find', this.q);
    // if (this.date[0] && this.date[1]) {
    //   params = params
    //     .append('startDate', dayjs(this.date[0]).format('YYYY-MM-DDT00:00:00'))
    //     .append('endDate', dayjs(this.date[1]).format('YYYY-MM-DDT00:00:00'));
    // }
    // this.newsletterService.getList(params).subscribe(
    //   (response) => {
    //     console.log(response.data);
    //     this.list = response.data as NewsLetter[];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  ngOnInit(): void {
    this.fetch();
  }

  pageChange1(p: number): void {
    this.page1 = p;
    this.fetch();
  }
  pageSizeChange1(s: number): void {
    this.pageSize1 = s;
    this.fetch();
  }

  pageChange2(p: number): void {
    this.page2 = p;
    this.fetch();
  }
  pageSizeChange2(s: number): void {
    this.pageSize2 = s;
    this.fetch();
  }
}
