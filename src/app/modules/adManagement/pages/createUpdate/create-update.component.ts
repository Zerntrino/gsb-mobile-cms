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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-ad-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  roleEditable = [1, 2].includes(this.authService.getRole() || 0);

  id = 'create';
  navItems = [
    { title: 'จัดการโฆษณา', to: '/ad-management' },
    { title: 'สร้างโฆษณา', to: '' },
  ];
  mode = 'edit';

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    linkUrl: new FormControl(''),
    isActive: new FormControl(true),
    imageUrl: new FormControl('', [Validators.required]),
  });
  imageBase64 = '';
  image: File | null = null;
  fileErrorId = 0;
  fileError = '';
  currentDate = new Date(
    new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0)
  ).toISOString();

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private adService: AdService,
    private toastService: ToastService,
    private _location: Location,
    private routeHistory: RouteHistoryService,
    private authService: AuthService
  ) {
    this.id = activatedRoute.snapshot.params['id'];

    activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'view') {
        this.mode = 'view';
        this.submitForm.disable();
      }

      this.navItems[1].title =
        this.id == 'create'
          ? 'สร้างโฆษณา'
          : this.mode == 'view'
          ? 'รายละเอียดโฆษณา'
          : 'แก้ไขโฆษณา';
    });
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    if (this.id != 'create') {
      this.adService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Ad;
          this.submitForm.setValue({
            name: res.name,
            startDate: res.startDate,
            endDate: res.endDate,
            linkUrl: res.linkUrl,
            isActive: res.isActive,
            imageUrl: res.imageUrl,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  inputFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);
    if (file) {
      if (
        file.size > 2000000 ||
        !['png'].includes(
          file.name.split('.')?.pop()?.toLocaleLowerCase() || ''
        )
      ) {
        this.fileErrorId = Math.random();
        this.fileError =
          'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบชนิดและขนาดไฟล์อีกครั้ง';
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width != 626 || img.height != 884) {
            this.fileErrorId = Math.random();
            this.fileError =
              'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.imageBase64 = reader.result?.toString() || '';
          this.image = file;
          this.submitForm.get('imageUrl')?.setValue(this.imageBase64);
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  async onSubmit() {
    if (this.imageBase64) {
      const data = new FormData();
      data.append('file', this.image as File);
      const upload = await this.adService.upload(data).toPromise();
      this.submitForm.get('imageUrl')?.setValue(upload?.data || '');
    }

    if (this.id == 'create') {
      this.adService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/ad-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
        }
      );
    } else {
      this.adService
        .update(parseInt(this.id), this.submitForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.router.navigate(['/ad-management']);
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
          }
        );
    }
  }

  edit() {
    this.mode = 'edit';
    this.submitForm.enable();
    this.navItems[1].title = 'แก้ไขโฆษณา';
  }

  dateBeforeNow(d: string | null | undefined): boolean {
    const date = dayjs(d);
    const c = dayjs(this.currentDate);
    const diff = date.diff(c, 'minute');
    return diff <= 0;
  }

  startDateFilter(e: Date | null): boolean {
    const date = dayjs(e);
    const c = dayjs();
    const diff = date.diff(c, 'day');
    return diff >= 0;
  }

  endDateFilter = (e: Date | null): boolean => {
    const date = dayjs(e);
    var c = dayjs();
    var diff = 0;
    if (this.submitForm?.get('startDate')?.value) {
      c = dayjs(this.submitForm.get('startDate')?.value);
      diff = date.diff(c, 'day');
    } else {
      diff = date.diff(c, 'day');
    }
    return diff >= 0;
  };

  back() {
    this.router.navigateByUrl(
      this.routeHistory.getPreviousUrl() || '/ad-management'
    );
  }
}
