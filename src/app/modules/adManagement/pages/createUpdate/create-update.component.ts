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

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    linkUrl: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
    imageUrl: new FormControl(''),
  });
  imageBase64 = '';
  fileErrorId = 0;
  fileError = '';

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private adService: AdService,
    private toastService: ToastService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title = this.id == 'create' ? 'สร้างโฆษณา' : 'แก้ไขโฆษณา';
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
        !['jpg', 'jpeg', 'png', 'gif'].includes(
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
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  async onSubmit() {
    if (this.imageBase64) {
      const upload = await this.adService
        .upload({
          imageBase64: this.imageBase64,
        })
        .toPromise();
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
          this.toastService.add('error', error);
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
            this.toastService.add('error', error);
          }
        );
    }
  }
}
