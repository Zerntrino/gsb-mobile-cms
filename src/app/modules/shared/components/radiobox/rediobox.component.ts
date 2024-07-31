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
  selector: 'app-radiobox',
  templateUrl: './radiobox.component.html',
  styleUrls: ['./radiobox.component.css'],
})
export class RadioboxComponent {
  @Input() value: boolean | undefined | string = false;
  @Input() name: string = '';
  @Output() valueUpdate = new EventEmitter<boolean>();
  @Input() disabled: boolean = false;
  randomId = Math.random().toString(36).slice(2, 7);

  constructor(private router: Router) {}

  change(e: Event): void {
    const v = (e.target as HTMLInputElement).checked;
    console.log(v);
    if (v) {
      this.value = true;
      this.valueUpdate.emit(true);
    } else {
      this.value = false;
      this.valueUpdate.emit(false);
    }
  }
}
