import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`/api/cms/category`, {
      params: params,
    });
  }
  getListReward(params?: HttpParams): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`/api/category/reward`, {
      params: params,
    });
  }
  getListPromotion(params?: HttpParams): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`/api/category/promotion`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(`/api/cms/category/totalpage`, {
      params: params,
    });
  }

  getListRewardTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `/api/cms/category/reward/totalpage`,
      {
        params: params,
      }
    );
  }

  getListPromotionTotal(
    params?: HttpParams
  ): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(
      `/api/cms/category/promotion/totalpage`,
      {
        params: params,
      }
    );
  }

  get(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`/api/cms/category/${id}`, {});
  }

  create(object: object): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`/api/cms/category`, object);
  }
  update(id: number, object: object): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(
      `/api/cms/category/${id}`,
      object
    );
  }
  delete(id: number): Observable<ApiResponse<Category>> {
    return this.http.delete<ApiResponse<Category>>(`/api/cms/category/${id}`);
  }

  upload(object: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`/api/upload/category`, object);
  }
}
