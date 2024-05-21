import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Banner } from '../models/banner.model';

@Injectable({
  providedIn: 'root',
})
export class BannerService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(`${this.apiUrl}/cms/banner`, {
      params: params,
    });
  }

  get(id: string): Observable<ApiResponse<Banner>> {
    return this.http.get<ApiResponse<Banner>>(
      `${this.apiUrl}/cms/banner/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<Banner>> {
    return this.http.post<ApiResponse<Banner>>(
      `${this.apiUrl}/cms/banner`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<Banner>> {
    return this.http.put<ApiResponse<Banner>>(
      `${this.apiUrl}/cms/banner/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Banner>> {
    return this.http.delete<ApiResponse<Banner>>(
      `${this.apiUrl}/cms/banner/${id}`
    );
  }

  upload(object: object): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/banner`,
      object
    );
  }

  getHighlight(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(
      `${this.apiUrl}/cms/banner/highlight`,
      {}
    );
  }
  updateHighlight(object: object): Observable<ApiResponse<Banner[]>> {
    return this.http.post<ApiResponse<Banner[]>>(
      `${this.apiUrl}/cms/banner/highlight`,
      object
    );
  }
}
