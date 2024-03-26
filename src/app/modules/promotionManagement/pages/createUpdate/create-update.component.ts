import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import { Ad } from 'src/app/core/models/ad.model';
import { AdService } from 'src/app/core/services/ad.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-ad-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการโฆษณา', to: '' },
    { title: 'สร้างโฆษณา', to: '' },
  ];

  dt1 = '';
  dt2 = '';

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private adService: AdService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title = this.id == 'create' ? 'สร้างโฆษณา' : 'แก้ไขโฆษณา';
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
