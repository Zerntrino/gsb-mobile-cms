import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { NavItem } from 'src/app/modules/shared/components/nav/nav.component';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';

@Component({
  selector: 'app-user-management-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  id: string = '';
  navItems = [
    { title: 'จัดการผู้ใช้บัตร', to: '' },
    { title: 'ข้อมูลผู้ใช้บัตร', to: '' },
    { title: 'บัตรเครดิต', to: '' },
  ];
  tabs = ['ประวัติการแลกคะแนน', 'ประวัติการใช้โปรโมชัน'];
  tab = 0;

  select2: Select2Value = '';
  select2Datas: Select2Option[] = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ];

  select2Update(e: Select2UpdateEvent): void {
    this.select2 = e.value;
    console.log(this.select2);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];

    // this.userService.getUserProfile(this.id).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  ngOnInit(): void {}
}
