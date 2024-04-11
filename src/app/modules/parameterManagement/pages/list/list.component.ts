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
import { ParameterService } from 'src/app/core/services/parameter.service';
import { Installment } from 'src/app/core/models/parameter.model';

@Component({
  selector: 'app-reward-history-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    {
      value: '',
      label: 'ทั้งหมด',
    },
  ];

  list: Installment[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(
    private router: Router,
    private parameterService: ParameterService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('length', this.pageSize);
    if (this.q) params = params.append('find', this.q);

    this.parameterService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Installment[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.fetch();
  }

  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.fetch();
    }
  }

  pageChange(p: number): void {
    this.page = p;
    this.fetch();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this.fetch();
  }
  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  pull(ar: number[], i: number): number[] {
    return pull(ar, i);
  }
}
