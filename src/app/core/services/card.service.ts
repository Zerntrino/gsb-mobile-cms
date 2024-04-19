import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { Ad } from '../models/ad.model';
import { Banner } from '../models/banner.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  getList(params?: HttpParams): Observable<ApiResponse<Card[]>> {
    console.log(params?.toString());
    return this.http.get<ApiResponse<Card[]>>(`${this.apiUrl}/cms/card`, {
      params: params,
    });
  }
}
