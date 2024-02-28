import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { NavItem } from 'src/app/modules/shared/components/nav/nav.component';

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
