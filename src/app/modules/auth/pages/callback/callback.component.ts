import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  page = 'callback';

  error = '';

  ngOnInit(): void {
    // get code from url oauth2 protocol
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // You can handle the code here, e.g., send it to your backend or exchange for tokens
      console.log('OAuth2 code:', code);
      this.authService.callback(code).subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.error = 'ข้อมูลของคุณไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง';
        }
      );
    } else {
      this.error = 'ไม่พบโค้ดสำหรับการยืนยันตัวตน';
    }
  }
}
