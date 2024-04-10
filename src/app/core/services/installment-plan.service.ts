import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { InstallmentPlan } from '../models/installment-plan.model';

@Injectable({
  providedIn: 'root',
})
export class InstallmentPlanService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<InstallmentPlan[]>> {
    return this.http.get<ApiResponse<InstallmentPlan[]>>(
      `${this.apiUrl}/cms/installment`,
      {
        params: params,
      }
    );
  }
}
