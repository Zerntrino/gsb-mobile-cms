import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  private oktaStateService = inject(OktaAuthStateService);
  private oktaAuth = inject(OKTA_AUTH);

  page = 'login';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  error = '';
  isForgot = false;

  ngOnInit(): void {}

  onSubmit(): void {
    const email = this.loginForm.get('email')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    this.error = '';

    this.authService.login(email, password).subscribe(
      (response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        this.error = 'ข้อมูลของคุณไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง';
        // this.toastService.add(
        //   'error',
        //   'ชื่อผู้ใช้งาน / อีเมล์ หรือ รหัสผ่าน ไม่ถูกต้อง'
        // );
      }
    );
  }

  oktaLogin(): void {
    this.oktaAuth.signInWithRedirect({
      originalUri: this.authService.getRedirectUrl(),
    });
  }
}
