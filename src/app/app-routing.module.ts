import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './modules/shared/pages/error404/error404.component';
import { LayoutComponent } from './modules/shared/pages/layout/layout.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { APP_BASE_HREF } from '@angular/common';

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
    path: 'newsletter-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './modules/newsletterManagement/newsletter-management.module'
          ).then((m) => m.NewsletterManagementModule),
        data: { title: 'Newsletter Management' },
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
          import(
            './modules/promotionManagement/promotion-management.module'
          ).then((m) => m.PromotionManagementModule),
        data: { title: 'Promotion Management' },
      },
    ],
  },
  {
    path: 'promotion-history',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/promotionHistory/promotion-history.module').then(
            (m) => m.PromotionHistoryModule
          ),
        data: { title: 'Promotion History' },
      },
    ],
  },
  {
    path: 'reward-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/rewardManagement/reward-management.module').then(
            (m) => m.RewardManagementModule
          ),
        data: { title: 'Reward Management' },
      },
    ],
  },
  {
    path: 'reward-history',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/rewardHistory/reward-history.module').then(
            (m) => m.RewardHistoryModule
          ),
        data: { title: 'Reward History' },
      },
    ],
  },
  {
    path: 'category-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './modules/categoryManagement/category-management.module'
          ).then((m) => m.CategoryManagementModule),
        data: { title: 'Category' },
      },
    ],
  },
  {
    path: 'partner-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/partnerManagement/partner-management.module').then(
            (m) => m.PartnerManagementModule
          ),
        data: { title: 'Partner' },
      },
    ],
  },
  {
    path: 'privilege',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/privilegeManagement/privilege.module').then(
            (m) => m.PrivilegeModule
          ),
        data: { title: 'Privilege' },
      },
    ],
  },
  {
    path: 'parameter',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/parameterManagement/parameter.module').then(
            (m) => m.ParameterModule
          ),
        data: { title: 'parameter' },
      },
    ],
  },
  {
    path: 'admin-management',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/adminManagement/admin-management.module').then(
            (m) => m.AdminManagementModule
          ),
        data: { title: 'Admin' },
      },
    ],
  },
  {
    path: 'audit-log',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auditLog/audit-log.module').then(
            (m) => m.AuditLogModule
          ),
        data: { title: 'audit-log' },
      },
    ],
  },
  {
    path: 'security-log',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/securityLog/security-log.module').then(
            (m) => m.SecurityLogModule
          ),
        data: { title: 'security-log' },
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
  providers: [{ provide: APP_BASE_HREF, useValue: '/cms' }],
})
export class AppRoutingModule {}
