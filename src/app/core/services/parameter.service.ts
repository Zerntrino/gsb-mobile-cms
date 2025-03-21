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
    return this.http.get<ApiResponse<Installment[]>>(`/api/cms/installment`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `/api/cms/installment/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<Installment>> {
    return this.http.get<ApiResponse<Installment>>(
      `/api/cms/installment/${id}`
    );
  }
  create(object: object): Observable<ApiResponse<Installment>> {
    return this.http.post<ApiResponse<Installment>>(
      `/api/cms/installment/management`,
      object
    );
  }
  update(id: number, object: object): Observable<ApiResponse<Installment>> {
    return this.http.put<ApiResponse<Installment>>(
      `/api/cms/installment/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Installment>> {
    return this.http.delete<ApiResponse<Installment>>(
      `/api/cms/installment/${id}`
    );
  }

  getInstallmentPlanList(
    params?: HttpParams
  ): Observable<ApiResponse<InstallmentPlan[]>> {
    return this.http.get<ApiResponse<InstallmentPlan[]>>(
      `/api/cms/installment/plan`,
      {
        params: params,
      }
    );
  }
  getInstallmentPlanListTotal(
    params?: HttpParams
  ): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `/api/cms/installment/plan/totalpage`,
      {
        params: params,
      }
    );
  }
  getInstallmentPlan(id: number): Observable<ApiResponse<InstallmentPlan>> {
    return this.http.get<ApiResponse<InstallmentPlan>>(
      `/api/cms/installment/plan/${id}`
    );
  }
  deleteInstallmentPlan(id: number): Observable<ApiResponse<InstallmentPlan>> {
    return this.http.delete<ApiResponse<InstallmentPlan>>(
      `/api/cms/installment/plan/${id}`
    );
  }
  createInstallmentPlan(
    object: object
  ): Observable<ApiResponse<InstallmentPlan>> {
    return this.http.post<ApiResponse<InstallmentPlan>>(
      `/api/cms/installment/plan`,
      object
    );
  }
  updateInstallmentPlan(
    id: number,
    object: object
  ): Observable<ApiResponse<Installment>> {
    return this.http.put<ApiResponse<Installment>>(
      `/api/cms/installment/plan/${id}`,
      object
    );
  }

  getMCCList(params?: HttpParams): Observable<ApiResponse<MCC[]>> {
    return this.http.get<ApiResponse<MCC[]>>(`/api/cms/mcc`, {
      params: params,
    });
  }

  getInstallmentMCCList(
    params?: HttpParams
  ): Observable<ApiResponse<ParameterMCC[]>> {
    return this.http.get<ApiResponse<ParameterMCC[]>>(
      `/api/cms/installment/mcc`,
      {
        params: params,
      }
    );
  }
  updateInstallmentMCC(
    id: number,
    object: object
  ): Observable<ApiResponse<ParameterMCC>> {
    return this.http.put<ApiResponse<ParameterMCC>>(
      `/api/cms/installment/mcc/${id}`,
      object
    );
  }

  getInstallmentMinimumList(
    params?: HttpParams
  ): Observable<ApiResponse<ParameterMinimum[]>> {
    return this.http.get<ApiResponse<ParameterMinimum[]>>(
      `/api/cms/installment/expenses`,
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
      `/api/cms/installment/expenses/${id}`,
      {
        minimumAmount,
      }
    );
  }
}
