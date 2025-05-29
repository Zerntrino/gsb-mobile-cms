import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CallbackComponent } from './pages/callback/callback.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: 'callback',
    component: CallbackComponent,
    data: {
      title: 'Callback',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
