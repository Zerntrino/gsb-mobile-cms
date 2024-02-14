import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AppUserService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getAppRoles(): Observable<ApiResponse<object[]>> {
    return this.http.get<ApiResponse<object[]>>(
      `${this.apiUrl}/AppUser/AppRole/All`
    );
  }
}
