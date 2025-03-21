import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { NewsLetter } from '../models/newsletter.model';

@Injectable({
  providedIn: 'root',
})
export class NewsLetterService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<NewsLetter[]>> {
    return this.http.get<ApiResponse<NewsLetter[]>>(`/api/cms/notification`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `/api/cms/notification/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<NewsLetter>> {
    return this.http.get<ApiResponse<NewsLetter>>(
      `/api/cms/notification/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<NewsLetter>> {
    return this.http.post<ApiResponse<NewsLetter>>(
      `/api/cms/notification`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<NewsLetter>> {
    return this.http.put<ApiResponse<NewsLetter>>(
      `/api/cms/notification/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<NewsLetter>> {
    return this.http.delete<ApiResponse<NewsLetter>>(
      `/api/cms/notification/${id}`
    );
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `/api/upload/notification`,
      object
    );
  }
}
