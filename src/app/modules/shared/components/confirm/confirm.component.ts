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
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent {
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
