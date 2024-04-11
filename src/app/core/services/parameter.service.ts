import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, BaseService, Paginate } from './base.service';
import {
  Installment,
  InstallmentPlan,
  MCC,
  ParameterMCC,
  ParameterMinimum,
} from '../models/parameter.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }
  getList(params?: HttpParams): Observable<ApiResponse<Installment[]>> {
    return this.http.get<ApiResponse<Installment[]>>(
      `${this.apiUrl}/cms/installment`,
      {
        params: params,
      }
    );
  }

  getInstallmentPlanList(
    params?: HttpParams
  ): Observable<ApiResponse<InstallmentPlan[]>> {
    return this.http.get<ApiResponse<InstallmentPlan[]>>(
      `${this.apiUrl}/cms/installment/plan`,
      {
        params: params,
      }
    );
  }

  getMCCList(params?: HttpParams): Observable<ApiResponse<MCC[]>> {
    return this.http.get<ApiResponse<MCC[]>>(`${this.apiUrl}/cms/mcc`, {
      params: params,
    });
  }

  getInstallmentMCCList(
    params?: HttpParams
  ): Observable<ApiResponse<ParameterMCC[]>> {
    return this.http.get<ApiResponse<ParameterMCC[]>>(
      `${this.apiUrl}/cms/installment/mcc`,
      {
        params: params,
      }
    );
  }

  getInstallmentMinimumList(
    params?: HttpParams
  ): Observable<ApiResponse<ParameterMinimum[]>> {
    return this.http.get<ApiResponse<ParameterMinimum[]>>(
      `${this.apiUrl}/cms/installment/expenses`,
      {
        params: params,
      }
    );
  }
  updateInstallmentMinimum(
    id: number,
    minimumAmount: number
  ): Observable<ApiResponse<object>> {
    return this.http.put<ApiResponse<object>>(
      `${this.apiUrl}/cms/installment/expenses/${id}`,
      {
        minimumAmount,
      }
    );
  }
}
