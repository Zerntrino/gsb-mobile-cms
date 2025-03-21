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
    return this.http.get<ApiResponse<Partner[]>>(`/api/cms/partner`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(`/api/cms/partner/totalpage`, {
      params: params,
    });
  }

  get(id: string): Observable<ApiResponse<Partner>> {
    return this.http.get<ApiResponse<Partner>>(`/api/cms/partner/${id}`, {});
  }

  create(object: object): Observable<ApiResponse<Partner>> {
    return this.http.post<ApiResponse<Partner>>(`/api/cms/partner`, object);
  }

  update(id: number, object: object): Observable<ApiResponse<Partner>> {
    return this.http.put<ApiResponse<Partner>>(
      `/api/cms/partner/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Partner>> {
    return this.http.delete<ApiResponse<Partner>>(`/api/cms/partner/${id}`);
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`/api/upload/partner`, object);
  }

  getHighlight(): Observable<ApiResponse<Partner[]>> {
    return this.http.get<ApiResponse<Partner[]>>(
      `/api/cms/partner/highlight`,
      {}
    );
  }
  updateHighlight(object: object): Observable<ApiResponse<Partner[]>> {
    return this.http.post<ApiResponse<Partner[]>>(
      `/api/cms/partner/highlight`,
      object
    );
  }
}
