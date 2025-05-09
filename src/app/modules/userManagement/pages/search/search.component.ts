import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-management-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(13)]), // 1100400223049
  });
  errorId = 0;
  error = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  async onSubmit() {
    const id = this.searchForm.get('id')?.value || '';

    const res = await this.userService.getUser(id);
    if (res instanceof Error) {
      console.log(res);
      this.errorId = Math.random();
      this.error = 'ไม่พบข้อมูลที่ตรงกัน <br/> กรุณาตรวจสอบอีกครั้ง';
    } else {
      this.router.navigate([`/user-management/${id}`]);
    }
  }
}

// 3049 14201 100110040022 1224
// 3049 14201 100110040022 1224
