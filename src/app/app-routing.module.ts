import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './modules/shared/pages/error404/error404.component';
import { LayoutComponent } from './modules/shared/pages/layout/layout.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: { title: 'Dashboard' },
      },
    ],
  },
  {
    path: 'user-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/userManagement/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        data: { title: 'User Management' },
      },
    ],
  },
  {
    path: 'ad-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/adManagement/ad-management.module').then(
            (m) => m.AdManagementModule
          ),
        data: { title: 'Ad Management' },
      },
    ],
  },
  {
    path: 'banner-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/bannerManagement/banner-management.module').then(
            (m) => m.BannerManagementModule
          ),
        data: { title: 'Banner Management' },
      },
    ],
  },
  {
    path: 'promotion-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/promotionManagement/promotion-management.module').then(
            (m) => m.PromotionManagementModule
          ),
        data: { title: 'Promotion Management' },
      },
    ],
  },
  {
    path: '404-not-found',
    component: Error404Component,
    data: { title: '404' },
  },
  { path: '**', redirectTo: '404-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
