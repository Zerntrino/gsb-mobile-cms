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
    private auditLogService: AuditLogService
  ) {}

  ngOnInit(): void {
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
    this.fetch();
  }
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;
      this.fetch();
    }
  }
  actionChange(e: Select2UpdateEvent): void {
    if (this.action != e.value) {
      this.action = e.value;
      this.fetch();
    }
  }
  userGroupChange(e: Select2UpdateEvent): void {
    if (this.userGroup != e.value) {
      this.userGroup = e.value;
      this.fetch();
    }
  }

  dateChange(e: string[]): void {
    this.date = e;
    this.fetch();
  }

  pageChange(p: number): void {
    this.page = p;
    this.fetch();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
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
