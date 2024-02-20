import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected apiUrl = `${environment.apiUrl}/api`; // /${environment.apiVersion}

  constructor() {}

  // protected downloadFile(response): void {
  //   const url = window.URL.createObjectURL(response.data);
  //   const a = document.createElement('a');
  //   document.body.appendChild(a);
  //   a.setAttribute('style', 'display: none');
  //   a.href = url;
  //   a.download = response.filename;
  //   a.click();
  //   setTimeout(() => {
  //     window.URL.revokeObjectURL(url);
  //   }, 100);
  //   a.remove();
  // }
}

export class ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
}

export interface Paginate<T> {
  data: T;
  dataCount: number;
  total: number;
}
