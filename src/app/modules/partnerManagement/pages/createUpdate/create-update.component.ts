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
    { title: 'สร้างพาร์ทเนอร์', to: '' },
  ];

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
    imageBase64: new FormControl(''),
  });

  htmlContent = '';
  editorConfig = this.utilsService.editorConfig;

  tags: string[] = ['ชอปปิง', 'ร้านอาหาร', 'ท่องเที่ยว'];

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private partnerService: PartnerService,
    private toastService: ToastService,
    private utilsService: UtilsService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'สร้างพาร์ทเนอร์' : 'แก้ไขพาร์ทเนอร์';
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
            isActive: res.isActive,
            imageBase64: res.imageUrl,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  tagChange(e: string[]): void {
    this.tags = e;
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
        this.submitForm
          .get('imageBase64')
          ?.setValue(reader.result?.toString() || '');
      };
    }
  }

  onSubmit(): void {
    this.partnerService.create(this.submitForm.getRawValue()).subscribe(
      (response) => {
        this.router.navigate(['/partner-management']);
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', error);
      }
    );
  }
}
