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
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  @Input() value: boolean | undefined | string = false;
  // @Output() valueUpdate = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  // change(e: Event): void {
  //   const v = (e.target as HTMLInputElement).checked;
  //   if (v) {
  //     this.value = true;
  //     this.valueUpdate.emit(true);
  //   } else {
  //     this.value = false;
  //     this.valueUpdate.emit(false);
  //   }
  // }
}
