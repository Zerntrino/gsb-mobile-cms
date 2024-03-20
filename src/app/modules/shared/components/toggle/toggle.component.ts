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
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],
})
export class ToggleComponent {
  @Input() value: boolean | undefined | string = false;
  @Output() valueUpdate = new EventEmitter<boolean>();
  randomId = Math.random().toString(36).slice(2, 7);

  constructor(private router: Router) {}

  change(e: Event): void {
    const v = (e.target as HTMLInputElement).checked;
    if (v) {
      this.value = true;
      this.valueUpdate.emit(true);
    } else {
      this.value = false;
      this.valueUpdate.emit(false);
    }
  }
}
