import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { PromotionService } from 'src/app/core/services/promotion.service';
import { Promotion } from 'src/app/core/models/promotion.model';

@Component({
  selector: 'app-ad-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  category: Select2Value = '';
  categoryOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'ชอปปิง', label: 'ชอปปิง' },
    { value: 'ร้านอาหาร', label: 'ร้านอาหาร' },
    { value: 'ท่องเที่ยว', label: 'ท่องเที่ยว' },
  ];
  type: Select2Value = '';
  typeOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'ไม่ลงทะเบียนรับสิทธิ์', label: 'ไม่ลงทะเบียนรับสิทธิ์' },
    { value: 'ลงทะเบียนรับสิทธิ์', label: 'ลงทะเบียนรับสิทธิ์' },
    {
      value: 'ลงทะเบียนรับสิทธิ์(แสดงโค้ด)',
      label: 'ลงทะเบียนรับสิทธิ์(แสดงโค้ด)',
    },
  ];
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  list: Promotion[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  constructor(
    private router: Router,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('length', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.category)
      params = params.append('categoryName', this.category as string);
    if (this.type) params = params.append('type', this.type as string);
    if (this.status) params = params.append('status', this.status as string);

    this.promotionService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Promotion[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.fetch();
  }
  categoryChange(e: Select2UpdateEvent): void {
    if (this.category != e.value) {
      this.category = e.value;
      this.fetch();
    }
  }
  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;
      this.fetch();
    }
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
}
