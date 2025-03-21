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
    return this.http.get<ApiResponse<Banner[]>>(`/api/cms/banner`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(`/api/cms/banner/totalpage`, {
      params: params,
    });
  }

  get(id: string): Observable<ApiResponse<Banner>> {
    return this.http.get<ApiResponse<Banner>>(`/api/cms/banner/${id}`, {});
  }

  create(object: object): Observable<ApiResponse<Banner>> {
    return this.http.post<ApiResponse<Banner>>(`/api/cms/banner`, object);
  }
  update(id: number, object: object): Observable<ApiResponse<Banner>> {
    return this.http.put<ApiResponse<Banner>>(`/api/cms/banner/${id}`, object);
  }
  delete(id: number): Observable<ApiResponse<Banner>> {
    return this.http.delete<ApiResponse<Banner>>(`/api/cms/banner/${id}`);
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`/api/upload/banner`, object);
  }

  getHighlight(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(
      `/api/cms/banner/highlight`,
      {}
    );
  }
  updateHighlight(object: object): Observable<ApiResponse<Banner[]>> {
    return this.http.post<ApiResponse<Banner[]>>(
      `/api/cms/banner/highlight`,
      object
    );
  }
}
