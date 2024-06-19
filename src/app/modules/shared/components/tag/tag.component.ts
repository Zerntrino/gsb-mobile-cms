import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { find, get, pull } from 'lodash';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
})
export class TagComponent implements OnInit {
  @ViewChild('tagInput') tagInputRef!: ElementRef;
  @Input() value: string[] = [];
  @Output() valueUpdate = new EventEmitter<string[]>();
  @Input() placeholder = '';
  @Input() disabled: boolean = false;

  form: FormGroup = new FormGroup({
    tag: new FormControl('', []),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.disabled) this.form.disable();
    else this.form.enable();
  }

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.disabled) return;

    const inputValue: string = this.form.get('tag')?.value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space') {
        this.addTag(inputValue);
        this.form.get('tag')?.setValue('');
      }
    }
  }

  addTag(tag: string): void {
    if (this.disabled) return;

    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.value, tag)) {
      this.value.push(tag);
    }
    this.valueUpdate.emit(this.value);
  }

  removeTag(tag?: string): void {
    if (this.disabled) return;

    if (!!tag) {
      pull(this.value, tag);
    } else {
      this.value.splice(-1);
    }
    this.valueUpdate.emit(this.value);
  }
}
