import {
  Component,
  Input,
  Output,
  OnDestroy,
  OnInit,
  EventEmitter,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  show = false;
  @Input() width = 'w-48';
  @ViewChild('button') button!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        !this.button.nativeElement.contains(e.target) &&
        !this.dropdown.nativeElement.contains(e.target)
      ) {
        this.show = false;
      }
    });
  }

  click(): void {
    this.show = true;
  }
}
