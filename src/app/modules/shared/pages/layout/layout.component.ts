import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUserToken, LeftMenu } from 'src/app/core/models/app-user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnDestroy, OnInit {
  appUser?: AppUserToken;
  url?: string;
  leftMenus: LeftMenu[];
  leftMenuFull = false;

  constructor(private authService: AuthService, private router: Router) {
    this.appUser = undefined;
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));

    this.url = router.url;
    this.leftMenus = [
      {
        title: 'MENU',
        items: [
          {
            title: 'User Management',
            icon: 'assets/icons/menus/user.svg',
            to: '/user-management',
            active: this.url?.startsWith('/user-management'),
          } as LeftMenu,
          {
            title: 'Advertisement',
            icon: 'assets/icons/menus/ad.png',
            to: '/ad-management',
            active: this.url?.startsWith('/ad-management'),
          } as LeftMenu,
          {
            title: 'Banner',
            icon: 'assets/icons/menus/banner.svg',
            to: '/banner-management',
            active: this.url?.startsWith('/banner-management'),
          } as LeftMenu,
          // {
          //   title: 'Newsletter',
          //   icon: 'assets/icons/menus/news.svg',
          //   to: '/newslatter',
          //   active: this.url?.startsWith('/newslatter'),
          // } as LeftMenu,
        ],
      } as LeftMenu,
      {
        title: 'PROMOTION',
        items: [
          {
            title: 'Promotion Management',
            icon: 'assets/icons/menus/promotion.svg',
            to: '/promotion-management',
            active: this.url?.startsWith('/promotion-management'),
          } as LeftMenu,
          {
            title: 'Promotion History',
            icon: 'assets/icons/menus/promotion-history.svg',
            to: '/promotion-history',
            active: this.url?.startsWith('/promotion-history'),
          } as LeftMenu,
        ],
      } as LeftMenu,
      {
        title: 'REWARD',
        items: [
          {
            title: 'Reward Management',
            icon: 'assets/icons/menus/reward.svg',
            to: '/reward-management',
            active: this.url?.startsWith('/reward-management'),
          } as LeftMenu,
          {
            title: 'Reward History',
            icon: 'assets/icons/menus/reward-history.svg',
            to: '/reward-history',
            active: this.url?.startsWith('/reward-history'),
          } as LeftMenu,
        ],
      } as LeftMenu,
      {
        title: 'SETTING',
        items: [
          {
            title: 'Installment Plan',
            icon: 'assets/icons/menus/installment-plan.svg',
            to: '/installment-plan',
            active: this.url?.startsWith('/installment-plan'),
          } as LeftMenu,
        ],
      } as LeftMenu,
    ];
  }

  toggleLeftMenu(): void {
    this.leftMenuFull = !this.leftMenuFull;
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
