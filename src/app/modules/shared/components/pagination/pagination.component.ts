import {
  Component,
  Input,
  Output,
  OnDestroy,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2UpdateValue,
} from 'ng-select2-component';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalPage = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSizeOptions: Select2Option[] = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  constructor(private router: Router) {}

  pageChangeValue(i: number): void {
    this.page = i;
    this.pageChange.emit(i);
  }

  pageSizeChangeValue(e: Select2UpdateEvent): void {
    if (this.pageSize != e.value) {
      this.pageSize = e.value as number;
      this.pageSizeChange.emit(e.value as number);
    }
  }

  pageChangeUpDown(t: number): void {
    const next = this.page + t;
    if (next <= 0 || next > this.totalPage) {
    } else {
      this.pageChangeValue(next);
    }
  }
}
