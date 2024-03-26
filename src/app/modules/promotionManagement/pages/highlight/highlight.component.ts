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

@Component({
  selector: 'app-banner-management-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit {
  navItems = [
    { title: 'จัดการแบนเนอร์', to: '' },
    { title: 'เลือกไฮไลท์ : แบนเนอร์', to: '' },
  ];

  list: Banner[] = [];
  showSelected = false;
  q = '';

  constructor(private router: Router, private bannerService: BannerService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.bannerService.getList().subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Banner[];
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

  qChange(): void {}
  selectedClick(): void {
    this.showSelected = false;
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
}
