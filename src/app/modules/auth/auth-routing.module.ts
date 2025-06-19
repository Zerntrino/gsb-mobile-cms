import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { TokenComponent } from './pages/token/token.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  // {
  //   path: 'callback',
  //   component: CallbackComponent,
  //   data: {
  //     title: 'Callback',
  //   },
  // },
  {
    path: 'token',
    component: TokenComponent,
    data: {
      title: 'Token',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
