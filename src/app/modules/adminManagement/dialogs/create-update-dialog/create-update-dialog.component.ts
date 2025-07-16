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
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'create-udpate-admin-management-dialog',
  templateUrl: './create-update-dialog.component.html',
  styleUrls: ['./create-update-dialog.component.css'],
})
export class CreateUpdateadminDialogComponent implements OnInit {
  roleEditable = [1, 2].includes(this.authService.getRole() || 0);
  @Input() showDetail = -1;
  @Input() detail?: Admin;
  @Output() success = new EventEmitter<number>();

  @Input() mode = 'edit';

  createUpdateForm = new FormGroup({
    email: new FormControl(''),
    role: new FormControl(0),
    isActive: new FormControl(true),
  });

  roleOption: Select2Option[] = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Editor' },
    { value: 3, label: 'View' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['mode']);

    if (changes['mode']) {
      if (changes['mode'].currentValue === 'view') {
        console.log('disable');
        this.createUpdateForm.disable();
      } else {
        this.createUpdateForm.enable();
      }

      if (this.detail) {
        this.createUpdateForm.setValue({
          email: this.detail.email,
          role: this.detail.role,
          isActive: this.detail.isActive,
        });
        this.createUpdateForm.enable();
      }
    }
  }

  fetch(): void {}

  createClick(): void {
    console.log('createClick');
    this.showDetail = 0;
    this.createUpdateForm.setValue({
      email: '',
      role: 0,
      isActive: true,
    });
  }
  showDetailClick(item: Admin) {
    this.createUpdateForm.setValue({
      email: item.email,
      role: item.role,
      isActive: item.isActive,
    });
    this.showDetail = item.id || 0;
  }

  roleChange(e: Select2UpdateEvent): void {
    if (this.createUpdateForm.get('role')?.value != e.value && e.value) {
      this.createUpdateForm.get('role')?.setValue(e.value as number);
    }
  }

  async onCreateUpdateSubmit() {
    if (this.showDetail == 0) {
      await this.userService
        .create(this.createUpdateForm.getRawValue())
        .subscribe(
          (response) => {
            setTimeout(() => {
              this.toastService.add('success', 'ทำรายการสำเร็จ');
              this.fetch();
            }, 500);
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
            setTimeout(() => {
              this.toastService.add('success', 'ทำรายการสำเร็จ');
              this.fetch();
            }, 500);
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
