import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public toastService: ToastService) {}

  onActivate(event: any): void {}
  ngOnInit(): void {}

  removeToast(index: number) {
    this.toastService.remove(index);
  }
}
