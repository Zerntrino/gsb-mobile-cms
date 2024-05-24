import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-category-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  q = '';
  status: Select2Value = '';
  statusOption: Select2Option[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'true', label: 'แสดงผล' },
    { value: 'false', label: 'ไม่แสดงผล' },
  ];
  list: Category[] = [];
  page = 1;
  pageSize = 10;
  totalPage = 1;

  deleteId = 0;

  showDetail = -1;
  createUpdateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    iconImageUrl: new FormControl(''),
    isActive: new FormControl(true),
  });

  iconImageBase64 = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams()
      .append('page', this.page)
      .append('pageSize', this.pageSize);
    if (this.q) params = params.append('find', this.q);
    if (this.status) params = params.append('status', this.status as string);

    this.categoryService.getList(params).subscribe(
      (response) => {
        console.log(response.data);
        this.list = response.data as Category[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  qChange(): void {
    this.fetch();
  }
  statusChange(e: Select2UpdateEvent): void {
    if (this.status != e.value) {
      this.status = e.value;
      this.fetch();
    }
  }
  pageChange(p: number): void {
    this.page = p;
    this.fetch();
  }
  pageSizeChange(s: number): void {
    this.pageSize = s;
    this.fetch();
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
        this.iconImageBase64 = reader.result?.toString() || '';
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
    });
    this.showDetail = item.id || 0;
  }

  async onCreateUpdateSubmit() {
    if (this.iconImageBase64) {
      const upload = await this.categoryService
        .upload({
          imageBase64: this.iconImageBase64,
        })
        .toPromise();

      this.createUpdateForm.get('iconImageUrl')?.setValue(upload?.data || '');
    }

    if (this.showDetail == 0) {
      this.categoryService
        .create(this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            this.fetch();
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', error);
          }
        );
    } else {
      this.categoryService
        .update(this.showDetail, this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            this.fetch();
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', error);
          }
        );
    }

    this.showDetail = -1;
  }

  deleteClick(id: number | undefined) {
    this.deleteId = id || 0;
  }
  deleteConfirm(id: number) {
    this.categoryService.delete(id).subscribe(
      (response) => {
        this.fetch();
      },
      (error) => {
        console.log(error);
        this.toastService.add('error', error);
      }
    );
  }
}
