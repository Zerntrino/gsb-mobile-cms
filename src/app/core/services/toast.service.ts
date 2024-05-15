import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: { message: string; duration: number; type: 'success' | 'error' }[] =
    [];

  add(
    type: 'success' | 'error' = 'success',
    message: string,
    duration: number = 5000
  ) {
    this.toasts.push({ message, duration, type });
    setTimeout(() => this.remove(0), duration);
  }

  remove(index: number) {
    this.toasts.splice(index, 1);
  }
}
