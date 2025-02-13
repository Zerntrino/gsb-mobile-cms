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
import { PartnerService } from 'src/app/core/services/partner.service';
import { Partner } from 'src/app/core/models/partner.model';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-partner-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการพาร์ทเนอร์', to: '/partner-management' },
    { title: 'เพิ่มพาร์ทเนอร์', to: '' },
  ];

  mode = 'edit';

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
    imageUrl: new FormControl('', [Validators.required]),
    aboutIt: new FormControl<string[]>([]),
  });
  imageBase64 = '';
  image: File | null = null;
  fileErrorId = 0;
  fileError = '';

  editorConfig = this.utilsService.editorConfig;

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private partnerService: PartnerService,
    private toastService: ToastService,
    private utilsService: UtilsService
  ) {
    this.id = activatedRoute.snapshot.params['id'];

    activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'view') {
        this.mode = 'view';
        this.submitForm.disable();
        this.editorConfig.editable = false;
      }

      this.navItems[1].title =
        this.id == 'create'
          ? 'เพิ่มพาร์ทเนอร์'
          : this.mode == 'view'
          ? 'รายละเอียดพาร์ทเนอร์'
          : 'แก้ไขพาร์ทเนอร์';
    });
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    if (this.id != 'create') {
      this.partnerService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Partner;
          console.log(res);
          this.submitForm.setValue({
            name: res.name,
            description: res.description,
            isActive: res.isActive,
            imageUrl: res.imageUrl,
            aboutIt: res.aboutIt,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
    }
  }

  tagChange(e: string[]): void {
    this.submitForm.get('aboutIt')?.setValue(e);
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
          if (img.width != 168 || img.height != 168) {
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
      const upload = await this.partnerService.upload(data).toPromise();
      this.submitForm.get('imageUrl')?.setValue(upload?.data || '');
    }

    if (this.id == 'create') {
      this.partnerService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/partner-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
        }
      );
    } else {
      this.partnerService
        .update(parseInt(this.id), this.submitForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.router.navigate(['/partner-management']);
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
    this.editorConfig.editable = true;
    this.navItems[1].title = 'แก้ไขโปรโมชัน';
  }
}
