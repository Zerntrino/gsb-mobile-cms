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
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent {
  @Input() index = 0;
  @Input() tabs: string[] = [];
  @Output() tabChange = new EventEmitter<number>();

  constructor(private router: Router) {}

  tabClick(i: number): void {
    this.index = i;
    this.tabChange.emit(i);
  }
}
