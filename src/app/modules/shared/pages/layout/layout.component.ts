import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnDestroy, OnInit {
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

  toggleLeftMenu(): void {
    this.leftMenuFull = !this.leftMenuFull;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // this.mediaSubscription.unsubscribe();
  }

  onLogout(): void {
    // this.authService.onLogout();
  }
}
