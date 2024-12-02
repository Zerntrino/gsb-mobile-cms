import { HttpParams } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'create-udpate-category-management-dialog',
  templateUrl: './create-update-dialog.component.html',
  styleUrls: ['./create-update-dialog.component.css'],
})
export class CreateUpdateCategoryDialogComponent implements OnInit {
  @Input() showDetail = -1;
  @Input() detail?: Category;
  @Output() success = new EventEmitter<number>();

  @Input() mode = 'edit';

  createUpdateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    iconImageUrl: new FormControl(''),
    isActive: new FormControl(true),
    isPromotion: new FormControl(false),
    isReward: new FormControl(false),
  });

  iconImageBase64 = '';
  iconImage: File | null = null;
  fileErrorId = 0;
  fileError = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode == 'view') this.createUpdateForm.disable();
    else this.createUpdateForm.enable();

    if (this.detail) {
      this.createUpdateForm.setValue({
        name: this.detail.name,
        iconImageUrl: this.detail.iconImageUrl,
        isActive: this.detail.isActive,
        isPromotion: this.detail.isPromotion,
        isReward: this.detail.isReward,
      });
    }
  }

  fetch(): void {}

  inputFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);

    this.fileError = '';

    if (file) {
      if (
        file.size > 2000000 ||
        !['png'].includes(
          file.name.split('.')?.pop()?.toLocaleLowerCase() || ''
        )
      ) {
        this.fileErrorId = Math.random();
        this.fileError =
          '*ไม่สามารถอัพโหลดไฟล์ได้ กรุณาตรวจสอบชนิดและขนาดไฟล์อีกครั้ง';
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width != 96 || img.height != 96) {
            this.fileErrorId = Math.random();
            this.fileError =
              '*ไม่สามารถอัพโหลดไฟล์ได้ กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.iconImageBase64 = reader.result?.toString() || '';
          this.iconImage = file;
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  createClick(): void {
    this.showDetail = 0;
  }
  showDetailClick(item: Category) {
    this.createUpdateForm.setValue({
      name: item.name,
      iconImageUrl: item.iconImageUrl,
      isActive: item.isActive,
      isPromotion: item.isPromotion,
      isReward: item.isReward,
    });
    this.showDetail = item.id || 0;
  }

  async onCreateUpdateSubmit() {
    if (this.iconImageBase64) {
      const data = new FormData();
      data.append('file', this.iconImage as File);
      const upload = await this.categoryService.upload(data).toPromise();

      this.createUpdateForm.get('iconImageUrl')?.setValue(upload?.data || '');
    }

    if (this.showDetail == 0) {
      await this.categoryService
        .create(this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.fetch();
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', error);
          }
        );
    } else {
      await this.categoryService
        .update(this.showDetail, this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.fetch();
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', error);
          }
        );
    }

    this.success.emit(0);
  }

  cancelClick() {
    this.success.emit(0);
  }

  edit() {
    this.mode = 'edit';
    this.createUpdateForm.enable();
  }
}
