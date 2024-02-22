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
        data: { title: 'Search' },
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
