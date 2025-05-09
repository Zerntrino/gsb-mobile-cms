import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import { ApiResponse, BaseService } from './base.service';
import { AppUserToken } from '../models/app-user.model';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService implements OnDestroy {
  private timer?: Subscription;
  private appUser = new BehaviorSubject<AppUserToken>({} as AppUserToken);
  private loginUrl = '/auth';
  appUser$: Observable<AppUserToken>;
  private redirectUrl = '/user-management';

  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getLoginUrl(): string {
    return this.loginUrl;
  }

  private storageEventListener(event: StorageEvent): void {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.onLogout('');
      }
      if (event.key === 'login-event') {
        // this.stopTokenTimer();
        this.http
          .get<ApiResponse<AppUserToken>>(`/api/me`)
          .subscribe((response) => {
            if (response.success) {
              this.appUser.next(response.data as AppUserToken);
            }
          });
      }
    }
  }

  constructor(private router: Router, private http: HttpClient) {
    super();
    this.appUser.next(this.appUserDataStorage);
    this.appUser$ = this.appUser.asObservable();
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  login(email: string, password: string): Observable<Response<AppUserToken>> {
    return this.http
      .post<Response<AppUserToken>>(`/api/cms/signin`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          if (response.data.token) {
            this.onLogin(response.data);
          }
          return response;
        })
      );
  }

  logout(returnUrl?: string): void {
    this.http
      .post(`/api/cms/signout`, {})
      .pipe(
        finalize(() => {
          this.onLogout(returnUrl);
        })
      )
      .subscribe();
  }

  onLogin(token: AppUserToken): void {
    this.appUser.next(token);
    this.setUserStorage(token);
    this.setTokenStorage(token.token);
    // this.startTokenTimer();
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  onLogout(returnUrl?: string): void {
    this.appUser.next({} as AppUserToken);
    this.clearUserStorage();
    this.clearTokenStorage();
    // this.stopTokenTimer();
    if (returnUrl) {
      this.router.navigate([this.getLoginUrl()], {
        queryParams: { returnUrl },
      });
    } else {
      this.router.navigate([this.getLoginUrl()]);
    }
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  refreshToken(): Observable<ApiResponse<AppUserToken>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearTokenStorage();
    }
    return this.http
      .post<ApiResponse<AppUserToken>>(`/api/cms/token`, {
        refresh_token: refreshToken,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            const userToken = response.data as AppUserToken;
            this.setTokenStorage(userToken.token);
            // this.startTokenTimer();
          }
          return response;
        })
      );
  }

  get appUserDataStorage(): AppUserToken {
    return localStorage.getItem('logined_user')
      ? JSON.parse(localStorage.getItem('logined_user') || '')
      : ({} as AppUserToken);
  }

  setUserStorage(appUser: AppUserToken): void {
    localStorage.setItem(
      'logined_user',
      JSON.stringify({
        id: appUser.id,
        name: appUser.name,
        imageUrl: appUser.imageUrl,
      })
    );
  }

  clearUserStorage(): void {
    localStorage.removeItem('logined_user');
  }

  setTokenStorage(token: string): void {
    localStorage.setItem('token', token);
    // localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokenStorage(): void {
    localStorage.removeItem('token');
    // localStorage.removeItem('refresh_token');
  }

  // private getTokenRemainingTime(): number {
  //   const accessToken = localStorage.getItem('access_token');
  //   if (!accessToken) {
  //     return 0;
  //   }
  //   const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
  //   const expires = new Date(jwtToken.exp * 1000);
  //   return expires.getTime() - Date.now();
  // }

  // private startTokenTimer(): void {
  //   const timeout = this.getTokenRemainingTime();
  //   this.timer = of(true)
  //     .pipe(
  //       delay(timeout),
  //       tap(() => this.refreshToken().subscribe())
  //     )
  //     .subscribe();
  // }

  // private stopTokenTimer(): void {
  //   this.timer?.unsubscribe();
  // }
}
