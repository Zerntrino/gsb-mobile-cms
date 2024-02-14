import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import { ApiResponse, BaseService } from './base.service';
import { AppUser, AppUserToken } from '../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService implements OnDestroy {
  private timer?: Subscription;
  private appUser = new BehaviorSubject<AppUser>({} as AppUser);
  private loginUrl = '/auth';
  appUser$: Observable<AppUser>;
  private redirectUrl = '/dashboard';

  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getLoginUrl(): string {
    return this.loginUrl;
  }

  get isSuperAdmin(): boolean {
    return this.appUser.value.app_role.role === 1000;
  }

  private storageEventListener(event: StorageEvent): void {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.onLogout('');
      }
      if (event.key === 'login-event') {
        this.stopTokenTimer();
        this.http
          .get<ApiResponse<AppUser>>(`${this.apiUrl}/me`)
          .subscribe((response) => {
            if (response.success) {
              this.appUser.next(response.data as AppUser);
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

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  login(email: string, password: string): Observable<AppUserToken> {
    return this.http
      .post<AppUserToken>(`${this.apiUrl}/guest/login`, { email, password })
      .pipe(
        map((response) => {
          if (response.access_token) {
            this.onLogin(response);
          }
          return response;
        })
      );
  }

  logout(returnUrl?: string): void {
    this.http
      .post(`${this.apiUrl}/logout`, {})
      .pipe(
        finalize(() => {
          this.onLogout(returnUrl);
        })
      )
      .subscribe();
  }

  onLogin(token: AppUserToken): void {
    console.log(token.app_user);
    this.appUser.next(token.app_user);
    this.setUserStorage(token.app_user);
    this.setTokenStorage(token.access_token, token.refresh_token);
    this.startTokenTimer();
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  onLogout(returnUrl?: string): void {
    this.appUser.next({} as AppUser);
    this.clearUserStorage();
    this.clearTokenStorage();
    this.stopTokenTimer();
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
      .post<ApiResponse<AppUserToken>>(`${this.apiUrl}/token`, {
        refresh_token: refreshToken,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            const userToken = response.data as AppUserToken;
            this.setTokenStorage(
              userToken.access_token,
              userToken.refresh_token
            );
            this.startTokenTimer();
          }
          return response;
        })
      );
  }

  get appUserDataStorage(): AppUser {
    return localStorage.getItem('logined_user')
      ? JSON.parse(localStorage.getItem('logined_user') || '')
      : null;
  }

  setUserStorage(appUser: AppUser): void {
    localStorage.setItem(
      'logined_user',
      JSON.stringify({
        id: appUser.id,
        user_no: appUser.user_no,
        role: appUser.app_role.role,
        firstname: appUser.firstname,
        lastname: appUser.lastname,
      })
    );
  }

  clearUserStorage(): void {
    localStorage.removeItem('logined_user');
  }

  setTokenStorage(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokenStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private getTokenRemainingTime(): number {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  private startTokenTimer(): void {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap(() => this.refreshToken().subscribe())
      )
      .subscribe();
  }

  private stopTokenTimer(): void {
    this.timer?.unsubscribe();
  }
}
