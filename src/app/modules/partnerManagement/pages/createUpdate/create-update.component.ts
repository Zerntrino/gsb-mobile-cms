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
    { title: 'จัดการพาร์ทเนอร์', to: '' },
    { title: 'เพิ่มพาร์ทเนอร์', to: '' },
  ];

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    isActive: new FormControl(true),
    imageUrl: new FormControl(''),
    aboutIt: new FormControl<string[]>([]),
  });
  imageBase64 = '';

  editorConfig = this.utilsService.editorConfig;

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private partnerService: PartnerService,
    private toastService: ToastService,
    private utilsService: UtilsService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'เพิ่มพาร์ทเนอร์' : 'แก้ไขพาร์ทเนอร์';
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageBase64 = reader.result?.toString() || '';
      };
    }
  }

  async onSubmit() {
    if (this.imageBase64) {
      const upload = await this.partnerService
        .upload({
          imageBase64: this.imageBase64,
        })
        .toPromise();
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
          this.toastService.add('error', error);
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
            this.toastService.add('error', error);
          }
        );
    }
  }
}
