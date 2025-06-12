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
import { UserService } from 'src/app/core/services/user.service';
import { Admin } from 'src/app/core/models/user.model';

@Component({
  selector: 'create-udpate-admin-management-dialog',
  templateUrl: './create-update-dialog.component.html',
  styleUrls: ['./create-update-dialog.component.css'],
})
export class CreateUpdateadminDialogComponent implements OnInit {
  @Input() showDetail = -1;
  @Input() detail?: Admin;
  @Output() success = new EventEmitter<number>();

  @Input() mode = 'edit';

  createUpdateForm = new FormGroup({
    userName: new FormControl(''),
    email: new FormControl(''),
    position: new FormControl(''),
    isActive: new FormControl(true),
    // password: new FormControl(''),
  });

  positionOption: Select2Option[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'view', label: 'View' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
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
        userName: this.detail.userName,
        email: this.detail.email,
        position: this.detail.position,
        isActive: this.detail.isActive,
        // password: this.detail.password,
      });
    }
  }

  fetch(): void {}

  createClick(): void {
    this.showDetail = 0;
  }
  showDetailClick(item: Admin) {
    this.createUpdateForm.setValue({
      userName: item.userName,
      email: item.email,
      position: item.position,
      isActive: item.isActive,
    });
    this.showDetail = item.id || 0;
  }

  positionChange(e: Select2UpdateEvent): void {
    if (this.createUpdateForm.get('position')?.value != e.value && e.value) {
      this.createUpdateForm.get('position')?.setValue(e.value as string);
    }
  }

  async onCreateUpdateSubmit() {
    if (this.showDetail == 0) {
      await this.userService
        .create(this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.fetch();
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
          }
        );
    } else {
      await this.userService
        .update(this.showDetail, this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.fetch();
          },
          (error) => {
            console.log(error);
            this.toastService.add('error', 'ทำรายการไม่สำเร็จ');
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
