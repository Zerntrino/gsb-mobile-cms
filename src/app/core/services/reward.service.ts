import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Reward, RewardHistory } from '../models/reward.model';

@Injectable({
  providedIn: 'root',
})
export class RewardService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<Reward[]>> {
    return this.http.get<ApiResponse<Reward[]>>(
      `${this.apiUrl}/cms/reward/management`,
      {
        params: params,
      }
    );
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `${this.apiUrl}/cms/reward/management/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<Reward>> {
    return this.http.get<ApiResponse<Reward>>(
      `${this.apiUrl}/cms/reward/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<Reward>> {
    return this.http.post<ApiResponse<Reward>>(
      `${this.apiUrl}/cms/reward`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<Reward>> {
    return this.http.put<ApiResponse<Reward>>(
      `${this.apiUrl}/cms/reward/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Reward>> {
    return this.http.delete<ApiResponse<Reward>>(
      `${this.apiUrl}/cms/reward/${id}`
    );
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/reward`,
      object
    );
  }

  getHighlights(cardId: string): Observable<ApiResponse<Reward[]>> {
    return this.http.get<ApiResponse<Reward[]>>(
      `${this.apiUrl}/cms/reward/card/${cardId}/highlight`,
      {}
    );
  }
  updateHighlights(object: object): Observable<ApiResponse<Reward[]>> {
    return this.http.post<ApiResponse<Reward[]>>(
      `${this.apiUrl}/cms/reward/highlight`,
      object
    );
  }

  getHistory(params?: HttpParams): Observable<ApiResponse<RewardHistory[]>> {
    return this.http.get<ApiResponse<RewardHistory[]>>(
      `${this.apiUrl}/cms/reward/history`,
      { params: params }
    );
  }
}
