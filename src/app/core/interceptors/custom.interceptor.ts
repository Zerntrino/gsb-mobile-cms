import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private readonly spinnerService: SpinnerService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const spinnerSubscription: Subscription =
      this.spinnerService.spinner$.subscribe();
    // add JWT auth header if a user is logged in for API requests
    const accessToken = localStorage.getItem('token');
    // const isApiUrl = request.url.startsWith(environment.apiUrl);

    // console.log('isApiUrl', isApiUrl);
    // console.log('request.url', request.url);
    // console.log('environment.apiUrl', environment.apiUrl);
    // console.log('accessToken', accessToken);

    if (accessToken && request.url != '/api/authen/okta/callback') {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authService.onLogout();
        }

        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(error);
      }),
      finalize(() => spinnerSubscription.unsubscribe())
    );
  }
}
