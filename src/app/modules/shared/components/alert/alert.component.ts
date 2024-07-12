import {
  Component,
  Input,
  Output,
  OnDestroy,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() show: number = 0;
  @Output() showChange = new EventEmitter<number>();

  @Input() title: string = 'ยืนยัน';
  @Input() description: string = '';
  @Output() confirm = new EventEmitter<number>();

  constructor() {}

  hideClick() {
    this.showChange.emit(0);
  }

  confirmClick() {
    this.confirm.emit(this.show);
    this.showChange.emit(0);
  }
}
