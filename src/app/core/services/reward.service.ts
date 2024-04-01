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
    console.log(params?.toString());
    return this.http.get<ApiResponse<Reward[]>>(
      `${this.apiUrl}/cms/reward/management`,
      {
        params: params,
      }
    );
  }

  getHighlights(): Observable<ApiResponse<Reward[]>> {
    return this.http.get<ApiResponse<Reward[]>>(
      `${this.apiUrl}/cms/reward/highlight`,
      {}
    );
  }
  getHistory(params?: HttpParams): Observable<ApiResponse<RewardHistory[]>> {
    return this.http.get<ApiResponse<RewardHistory[]>>(
      `${this.apiUrl}/cms/reward/history`,
      { params: params }
    );
  }
}
