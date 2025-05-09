import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { NavItem } from 'src/app/modules/shared/components/nav/nav.component';

@Component({
  selector: 'app-user-management-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  id: string = '';
  navItems = [
    { title: 'จัดการผู้ใช้บัตร', to: '/user-management' },
    { title: 'ข้อมูลผู้ใช้บัตร', to: '' },
  ];

  user = {} as User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  async fetch() {
    const res = await this.userService.getUser(this.id);
    if (res instanceof Error) {
      console.log(res);
    } else {
      this.user = (res?.data || {}) as User;
      console.log(res);
    }
  }

  ngOnInit(): void {
    this.fetch();
  }
}
