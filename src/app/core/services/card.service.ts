import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Ad } from '../models/ad.model';
import { Banner } from '../models/banner.model';
import { Card, CardRef } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getRef(params?: HttpParams): Observable<ApiResponse<CardRef[]>> {
    return this.http.get<ApiResponse<CardRef[]>>(
      `${this.apiUrl}/cms/card/referencecode`,
      {
        params: params,
      }
    );
  }

  getList(params?: HttpParams): Observable<ApiResponse<Card[]>> {
    return this.http.get<ApiResponse<Card[]>>(`${this.apiUrl}/cms/card`, {
      params: params,
    });
  }

  get(id: string): Observable<ApiResponse<Card>> {
    return this.http.get<ApiResponse<Card>>(
      `${this.apiUrl}/cms/card/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<Card>> {
    return this.http.post<ApiResponse<Card>>(`${this.apiUrl}/cms/card`, object);
  }
  update(id: number, object: object): Observable<ApiResponse<Card>> {
    return this.http.put<ApiResponse<Card>>(
      `${this.apiUrl}/cms/card/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Card>> {
    return this.http.delete<ApiResponse<Card>>(`${this.apiUrl}/cms/card/${id}`);
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/card`,
      object
    );
  }
}
