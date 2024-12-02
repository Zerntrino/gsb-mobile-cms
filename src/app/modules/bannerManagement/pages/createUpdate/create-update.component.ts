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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Banner } from 'src/app/core/models/banner.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-banner-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการแบนเนอร์', to: '/banner-management' },
    { title: 'สร้างแบนเนอร์', to: '' },
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

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private bannerService: BannerService,
    private toastService: ToastService
  ) {
    this.id = activatedRoute.snapshot.params['id'];

    activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'view') {
        this.mode = 'view';
        this.submitForm.disable();
      }

      this.navItems[1].title =
        this.id == 'create'
          ? 'สร้างแบนเนอร์'
          : this.mode == 'view'
          ? 'รายละเอียดแบนเนอร์'
          : 'แก้ไขแบนเนอร์';
    });
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    if (this.id != 'create') {
      this.bannerService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Banner;
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
          if (img.width != 1035 || img.height != 330) {
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
      const upload = await this.bannerService.upload(data).toPromise();
      this.submitForm.get('imageUrl')?.setValue(upload?.data || '');
    }

    if (this.id == 'create') {
      this.bannerService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/banner-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
    } else {
      this.bannerService
        .update(parseInt(this.id), this.submitForm.getRawValue())
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

  edit() {
    this.mode = 'edit';
    this.submitForm.enable();
    this.navItems[1].title = 'แก้ไขแบนเนอร์';
  }
}
