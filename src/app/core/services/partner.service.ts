import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Partner } from '../models/partner.model';

@Injectable({
  providedIn: 'root',
})
export class PartnerService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<Partner[]>> {
    console.log(params?.toString());
    return this.http.get<ApiResponse<Partner[]>>(`${this.apiUrl}/cms/partner`, {
      params: params,
    });
  }

  get(id: string): Observable<ApiResponse<Partner>> {
    return this.http.get<ApiResponse<Partner>>(
      `${this.apiUrl}/cms/partner/${id}`,
      {}
    );
  }

  create(object: object): Observable<ApiResponse<Partner>> {
    return this.http.post<ApiResponse<Partner>>(
      `${this.apiUrl}/cms/partner`,
      object
    );
  }

  update(id: number, object: object): Observable<ApiResponse<Partner>> {
    return this.http.put<ApiResponse<Partner>>(
      `${this.apiUrl}/cms/partner/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Partner>> {
    return this.http.delete<ApiResponse<Partner>>(
      `${this.apiUrl}/cms/partner/${id}`
    );
  }

  upload(object: object): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/upload/partner`,
      object
    );
  }
}
