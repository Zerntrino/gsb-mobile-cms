import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUserToken, LeftMenu } from 'src/app/core/models/app-user.model';
import { AuthService } from 'src/app/core/services/auth.service';
const { version } = require('../../../../../../package.json');
declare const require: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnDestroy, OnInit {
  appUser?: AppUserToken;
  url?: string;
  leftMenus: LeftMenu[];
  versionString = version;

  get leftMenuFull(): boolean {
    return localStorage.getItem('left-menu-full')
      ? JSON.parse(localStorage.getItem('left-menu-full') || '')
      : true;
  }

  constructor(private authService: AuthService, private router: Router) {
    this.appUser = undefined;
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));

    const role = authService.getRole();

    this.leftMenus = [
      {
        title: 'เมนู',
        items: [
          {
            title: 'จัดการผู้ใช้บัตร',
            icon: 'assets/icons/menus/user.svg',
            to: '/user-management',
            active: this.url?.startsWith('/user-management'),
          } as LeftMenu,
          {
            title: 'จัดการโฆษณา',
            icon: 'assets/icons/menus/ad.png',
            to: '/ad-management',
            active: this.url?.startsWith('/ad-management'),
          } as LeftMenu,
          {
            title: 'จัดการแบนเนอร์',
            icon: 'assets/icons/menus/banner.svg',
            to: '/banner-management',
            active: this.url?.startsWith('/banner-management'),
          } as LeftMenu,
          {
            title: 'จัดการการแจ้งเตือน',
            icon: 'assets/icons/menus/news.svg',
            to: '/newsletter-management',
            active: this.url?.startsWith('/newsletter-management'),
          } as LeftMenu,
        ],
      } as LeftMenu,
      {
        title: 'โปรโมชัน',
        items: [
          {
            title: 'จัดการโปรโมชัน',
            icon: 'assets/icons/menus/promotion.svg',
            to: '/promotion-management',
            active: this.url?.startsWith('/promotion-management'),
          } as LeftMenu,
          // {
          //   title: 'ประวัติการใช้โปรโมชัน',
          //   icon: 'assets/icons/menus/promotion-history.svg',
          //   to: '/promotion-history',
          //   active: this.url?.startsWith('/promotion-history'),
          // } as LeftMenu,
        ],
      } as LeftMenu,
      {
        title: 'รีวอร์ด',
        items: [
          {
            title: 'จัดการรีวอร์ด',
            icon: 'assets/icons/menus/reward.svg',
            to: '/reward-management',
            active: this.url?.startsWith('/reward-management'),
          } as LeftMenu,
          // {
          //   title: 'ประวัติการใช้รีวอร์ด',
          //   icon: 'assets/icons/menus/reward-history.svg',
          //   to: '/reward-history',
          //   active: this.url?.startsWith('/reward-history'),
          // } as LeftMenu,
        ],
      } as LeftMenu,
      {
        title: 'ตั้งค่า',
        items: [
          {
            title: 'จัดการหมวดหมู่',
            icon: 'assets/icons/menus/category.svg',
            to: '/category-management',
            active: this.url?.startsWith('/category-management'),
          } as LeftMenu,
          {
            title: 'จัดการพาร์ทเนอร์',
            icon: 'assets/icons/menus/partner.svg',
            to: '/partner-management',
            active: this.url?.startsWith('/partner-management'),
          } as LeftMenu,
          {
            title: 'จัดการสิทธิพิเศษ',
            icon: 'assets/icons/menus/privilege.png',
            to: '/privilege',
            active: this.url?.startsWith('/privilege'),
          } as LeftMenu,
          {
            title: 'จัดการการผ่อนชำระ',
            icon: 'assets/icons/menus/parameter.svg',
            to: '/parameter',
            active: this.url?.startsWith('/parameter'),
          } as LeftMenu,
          {
            title: 'จัดการผู้ใช้งาน',
            icon: 'assets/icons/menus/user-menu.svg',
            to: '/admin-management',
            active: this.url?.startsWith('/admin-management'),
          } as LeftMenu,
        ],
      } as LeftMenu,
      // {
      //   title: 'รายงาน',
      //   items: [
      //     {
      //       title: 'รายงานการตรวจสอบ',
      //       icon: 'assets/icons/menus/audit-log.svg',
      //       to: '/audit-log',
      //       active: this.url?.startsWith('/audit-log'),
      //     } as LeftMenu,
      //     {
      //       title: 'รายงานความปลอดภัย',
      //       icon: 'assets/icons/menus/security-log.svg',
      //       to: '/security-log',
      //       active: this.url?.startsWith('/security-log'),
      //     } as LeftMenu,
      //   ],
      // } as LeftMenu,
    ];

    this.url = router.url;
    if (role == 1) {
      // Admin
    } else if (role == 2) {
      // Editor
      this.leftMenus[3].items = this.leftMenus[3].items.slice(0, 3);
    } else if (role == 3) {
      // View
      this.leftMenus[3].items = this.leftMenus[3].items.slice(0, 3);
    } else {
      this.leftMenus = [];
    }
  }

  toggleLeftMenu(): void {
    localStorage.setItem('left-menu-full', `${!this.leftMenuFull}`);
  }

  logoutClick(): void {
    this.authService.logout();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // this.mediaSubscription.unsubscribe();
  }

  onLogout(): void {
    // this.authService.onLogout();
  }
}
