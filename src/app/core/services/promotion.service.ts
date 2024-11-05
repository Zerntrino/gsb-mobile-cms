import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import {
  Promotion,
  PromotionHistory,
  PromotionType,
} from '../models/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getTypes(): Observable<ApiResponse<PromotionType[]>> {
    return this.http.get<ApiResponse<PromotionType[]>>(
      `${this.apiUrl}/cms/promotion/type`,
      {}
    );
  }

  getList(params?: HttpParams): Observable<ApiResponse<Promotion[]>> {
    console.log(params?.toString());
    return this.http.get<ApiResponse<Promotion[]>>(
      `${this.apiUrl}/cms/promotion`,
      {
        params: params,
      }
    );
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `${this.apiUrl}/cms/promotion/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<Promotion>> {
    return this.http.get<ApiResponse<Promotion>>(
      `${this.apiUrl}/cms/promotion/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<Promotion>> {
    return this.http.post<ApiResponse<Promotion>>(
      `${this.apiUrl}/cms/promotion`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<Promotion>> {
    return this.http.put<ApiResponse<Promotion>>(
      `${this.apiUrl}/cms/promotion/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Promotion>> {
    return this.http.delete<ApiResponse<Promotion>>(
      `${this.apiUrl}/cms/promotion/${id}`
    );
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/promotion`,
      object
    );
  }

  getHighlights(cardId: string): Observable<ApiResponse<Promotion[]>> {
    return this.http.get<ApiResponse<Promotion[]>>(
      `${this.apiUrl}/cms/promotion/${cardId}/highlight`,
      {}
    );
  }
  updateHighlights(
    cardId: string,
    object: object
  ): Observable<ApiResponse<Promotion[]>> {
    return this.http.post<ApiResponse<Promotion[]>>(
      `${this.apiUrl}/cms/promotion/card/${cardId}/highlight`,
      object
    );
  }

  getHistory(params?: HttpParams): Observable<ApiResponse<PromotionHistory[]>> {
    return this.http.get<ApiResponse<PromotionHistory[]>>(
      `${this.apiUrl}/cms/promotion/history`,
      { params: params }
    );
  }
}
