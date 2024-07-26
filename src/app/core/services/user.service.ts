import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getUserProfile(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.apiUrl}/user/${id}/profile`
    );
  }
  getUser(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/account/${id}`);
  }
}
