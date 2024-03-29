import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Promotion } from '../models/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService extends BaseService {
  constructor(public http: HttpClient) {
    super();
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

  getHighlights(): Observable<ApiResponse<Promotion[]>> {
    return this.http.get<ApiResponse<Promotion[]>>(
      `${this.apiUrl}/cms/promotion/highlight`,
      {}
    );
  }
}
