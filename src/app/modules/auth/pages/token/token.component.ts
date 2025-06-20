import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  page = 'callback';
  private oktaAuth = inject(OKTA_AUTH);

  error = '';

  async ngOnInit() {
    const accessToken = await this.oktaAuth.getAccessToken();
    // const idToken = await this.oktaAuth.getIdToken()
    console.log(accessToken);
    // console.log(idToken)
    if (accessToken) {
      const res = await  this.authService.loginOkta(accessToken)
      if (res instanceof Error) {
        this.error = 'ไม่สามารถเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง'
      } else {
       this.router.navigate(['/'])
      }
    } else {
       this.error = 'ไม่สามารถเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง'
    }
  }
}
