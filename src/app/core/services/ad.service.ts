import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Ad } from '../models/ad.model';

@Injectable({
  providedIn: 'root',
})
export class AdService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<Ad[]>> {
    console.log(params?.toString());
    return this.http.get<ApiResponse<Ad[]>>(`${this.apiUrl}/cms/advertise`, {
      params: params,
    });
  }
}
