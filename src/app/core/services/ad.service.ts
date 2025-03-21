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
    return this.http.get<ApiResponse<Ad[]>>(`/api/cms/advertise`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `/api/cms/advertise/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<Ad>> {
    return this.http.get<ApiResponse<Ad>>(`/api/cms/advertise/${id}`, {});
  }

  create(object: object): Observable<ApiResponse<Ad>> {
    return this.http.post<ApiResponse<Ad>>(`/api/cms/advertise`, object);
  }
  update(id: number, object: object): Observable<ApiResponse<Ad>> {
    return this.http.put<ApiResponse<Ad>>(`/api/cms/advertise/${id}`, object);
  }
  delete(id: number): Observable<ApiResponse<Ad>> {
    return this.http.delete<ApiResponse<Ad>>(`/api/cms/advertise/${id}`);
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`/api/upload/advertise`, object);
  }
}
