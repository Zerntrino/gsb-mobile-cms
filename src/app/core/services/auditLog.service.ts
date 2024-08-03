import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Reward, RewardHistory } from '../models/reward.model';
import { AuditLog } from '../models/auditLog.model';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getAuditLogList(params?: HttpParams): Observable<ApiResponse<AuditLog[]>> {
    return this.http.get<ApiResponse<AuditLog[]>>(
      `${this.apiUrl}/cms/auditlog`,
      {
        params: params,
      }
    );
  }
  getAuditLogListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `${this.apiUrl}/cms/auditlog/totalpage`,
      {
        params: params,
      }
    );
  }

  getSecurityLogList(params?: HttpParams): Observable<ApiResponse<AuditLog[]>> {
    return this.http.get<ApiResponse<AuditLog[]>>(
      `${this.apiUrl}/cms/securitylog`,
      {
        params: params,
      }
    );
  }
  getSucurityLogListTotal(
    params?: HttpParams
  ): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `${this.apiUrl}/cms/securitylog/totalpage`,
      {
        params: params,
      }
    );
  }
}
