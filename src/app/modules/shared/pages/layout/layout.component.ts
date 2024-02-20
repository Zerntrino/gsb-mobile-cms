import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUserToken } from 'src/app/core/models/app-user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnDestroy, OnInit {
  appUser?: AppUserToken;
  leftMenus = [
    {
      title: 'MENU',
      items: [
        {
          title: 'User Management',
          icon: 'assets/icons/menus/user.svg',
          active: true,
        },
        { title: 'Banner', icon: 'assets/icons/menus/banner.svg' },
        { title: 'Newsletter', icon: 'assets/icons/menus/news.svg' },
      ],
    },
  ];
  leftMenuFull = false;

  constructor(private authService: AuthService) {
    this.appUser = undefined;
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
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
