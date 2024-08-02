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
    return this.http.get<ApiResponse<NewsLetter[]>>(
      `${this.apiUrl}/cms/notification`,
      {
        params: params,
      }
    );
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `${this.apiUrl}/cms/notification/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<NewsLetter>> {
    return this.http.get<ApiResponse<NewsLetter>>(
      `${this.apiUrl}/cms/notification/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<NewsLetter>> {
    return this.http.post<ApiResponse<NewsLetter>>(
      `${this.apiUrl}/cms/notification`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<NewsLetter>> {
    return this.http.put<ApiResponse<NewsLetter>>(
      `${this.apiUrl}/cms/notification/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<NewsLetter>> {
    return this.http.delete<ApiResponse<NewsLetter>>(
      `${this.apiUrl}/cms/notification/${id}`
    );
  }

  upload(object: object): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/notification`,
      object
    );
  }
}
