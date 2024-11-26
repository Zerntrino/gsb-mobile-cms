import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { BannerService } from 'src/app/core/services/banner.service';
import { Banner } from 'src/app/core/models/banner.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-banner-management-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit {
  navItems = [
    { title: 'จัดการแบนเนอร์', to: '/banner-management' },
    { title: 'เลือกไฮไลท์ : แบนเนอร์', to: '' },
  ];

  all: Banner[] = [];
  list: Banner[] = [];
  showSelected = false;
  q = '';

  constructor(
    private router: Router,
    private bannerService: BannerService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    await this.fetch();
    await this.fetchAll();
  }

  async fetch() {
    await this.bannerService.getHighlight().subscribe(
      (response) => {
        this.list = response.data as Banner[];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  async fetchAll() {
    let params = new HttpParams().append('page', 1).append('pageSize', 20);
    if (this.q) params = params.append('find', this.q);
    await this.bannerService.getList(params).subscribe(
      (response) => {
        const all = response.data as Banner[];
        const ids = this.list.map((l) => l.id);
        this.all = all.filter((l) => !ids.includes(l.id) && l.isActive);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeClick(id: number) {
    this.list = this.list.filter((l) => l.id != id);
  }

  async showSelectClick() {
    await this.fetchAll();
    this.showSelected = true;
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    console.log(this.list);
  }

  qChange(): void {
    this.fetchAll();
  }
  selectedClick(): void {
    const selects = this.all.filter((l) => l.select);
    this.list = this.list.concat(selects);
    this.showSelected = false;
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  confirmClick() {
    this.bannerService
      .updateHighlight({ bannerIds: this.list.map((l) => l.id) })
      .subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/banner-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
  }
}
