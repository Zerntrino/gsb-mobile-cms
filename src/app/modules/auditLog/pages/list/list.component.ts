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
import { AuditLog } from 'src/app/core/models/auditLog.model';
import { AuditLogService } from 'src/app/core/services/auditLog.service';
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';

@Component({
  selector: 'app-audit-log-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  type: Select2Value = 0;
  typeOption: Select2Option[] = [
    {
      value: 1,
      label: 'Audit Log',
    },
  ];
  action: Select2Value = 0;
  actionOption: Select2Option[] = [
    {
      value: 1,
      label: 'Edit Promotion',
    },
  ];
  userGroup: Select2Value = 0;
  userGroupOption: Select2Option[] = [
    {
      value: 1,
      label: 'GSB_SysAdmin',
    },
  ];

  q = '';

  date = ['', ''];

  selectIndex: number[] = [];

  list: AuditLog[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(
    private router: Router,
    private auditLogService: AuditLogService,
    private _location: Location,
    private routeHistory: RouteHistoryService
  ) {}

  ngOnInit(): void {
    this.page = Number(
      this.router.routerState.snapshot.root.queryParams['page'] || 1
    );
    this.pageSize = Number(
      this.router.routerState.snapshot.root.queryParams['pageSize'] || 10
    );
    this.q = this.router.routerState.snapshot.root.queryParams['q'];
    this.type = this.router.routerState.snapshot.root.queryParams['type'];
    this.action = this.router.routerState.snapshot.root.queryParams['action'];
    this.userGroup =
      this.router.routerState.snapshot.root.queryParams['userGroup'];

    this.date = (this.router.routerState.snapshot.root.queryParams[
      'date'
    ] as []) || ['', ''];

    this.fetch();
  }

  async fetch() {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);

    if (this.type) params = params.append('type', this.type.toString());
    if (this.action) params = params.append('action', this.action.toString());
    if (this.userGroup)
      params = params.append('userGroup', this.userGroup.toString());
    if (this.date[0] && this.date[1]) {
      params = params
        .append('startDate', dayjs(this.date[0]).format('YYYY-MM-DDT00:00:00'))
        .append('endDate', dayjs(this.date[1]).format('YYYY-MM-DDT00:00:00'));
    }

    await this.auditLogService.getAuditLogList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as AuditLog[];
      },
      (error) => {
        console.log(error);
      }
    );

    this.auditLogService.getAuditLogListTotal(params).subscribe(
      (response) => {
        this.totalPage = response.data?.totalPage || 1;
      },
      (error) => {}
    );
  }

  qChange(): void {
    this.page = 1;
    this.redirect();
  }
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value && e.value != undefined) {
      this.type = e.value;
      this.page = 1;
      this.redirect();
    }
  }
  actionChange(e: Select2UpdateEvent): void {
    if (this.action != e.value && e.value != undefined) {
      this.action = e.value;
      this.page = 1;
      this.redirect();
    }
  }
  userGroupChange(e: Select2UpdateEvent): void {
    if (this.userGroup != e.value && e.value != undefined) {
      this.userGroup = e.value;
      this.page = 1;
      this.redirect();
    }
  }

  dateChange(e: string[]): void {
    this.date = e;
    this.page = 1;
    this.redirect();
  }

  pageChange(p: number): void {
    this.page = p;
    this.redirect();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this.page = 1;
    this.redirect();
  }
  redirect() {
    this.router.navigate(['/audit-log'], {
      queryParams: {
        page: this.page,
        pageSize: this.pageSize,
        q: this.q,
        type: this.type,
        action: this.action,
        userGroup: this.userGroup,
        date: this.date,
      },
    });
    this.fetch();
  }
  selectIndexAllClick(v: boolean): void {
    this.selectIndex = [];
    if (v)
      this.list.forEach((e, i) => {
        this.selectIndex.push(i);
      });
  }
  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  clearFilter() {
    this.q = '';
    this.date = ['', ''];
    this.type = 0;
    this.action = 0;
    this.userGroup = 0;

    this.fetch();
  }
}
