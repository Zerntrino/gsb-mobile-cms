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

  get(id: string): Observable<ApiResponse<Ad>> {
    return this.http.get<ApiResponse<Ad>>(
      `${this.apiUrl}/cms/advertise/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<Ad>> {
    return this.http.post<ApiResponse<Ad>>(
      `${this.apiUrl}/cms/advertise`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<Ad>> {
    return this.http.put<ApiResponse<Ad>>(
      `${this.apiUrl}/cms/advertise/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Ad>> {
    return this.http.delete<ApiResponse<Ad>>(
      `${this.apiUrl}/cms/advertise/${id}`
    );
  }

  upload(object: object): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/advertise`,
      object
    );
  }
}
