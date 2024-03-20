import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { BannerService } from 'src/app/core/services/banner.service';

@Component({
  selector: 'app-banner-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการแบนเนอร์', to: '' },
    { title: 'สร้างแบนเนอร์', to: '' },
  ];

  dt1 = '';
  dt2 = '';

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private bannerService: BannerService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'สร้างแบนเนอร์' : 'แก้ไขแบนเนอร์';
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    // this.adService.getList(params).subscribe(
    //   (response) => {
    //     console.log(response.data);
    //     this.list = response.data as Ad[];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
}
