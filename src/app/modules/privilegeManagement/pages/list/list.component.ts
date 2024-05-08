import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import { Ad } from 'src/app/core/models/ad.model';
import { AdService } from 'src/app/core/services/ad.service';
import dayjs from 'dayjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/models/card.model';
import { Installment } from 'src/app/core/models/parameter.model';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-privilege-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  id = 0;

  cards: Card[] = [];

  type: Select2Value = '';
  typeOption: Select2Option[] = [];

  htmlContent = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName',
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        // 'link',
        'unlink',
        // 'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  tags: string[] = [];

  dataForm = new FormGroup({
    name: new FormControl(''),
    // description: new FormControl(''),
  });

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private parameterService: ParameterService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    let params = new HttpParams();
    this.cardService.getList(params).subscribe(
      (response) => {
        this.cards = response.data as Card[];
      },
      (error) => {}
    );
  }

  selectCard(card?: Card): void {
    this.id = card?.id || 0;
  }

  onSubmit(): void {
    this.parameterService
      .create({
        name: this.dataForm.get('name')?.value,
        description: this.dataForm.get('description')?.value,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {}
      );
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  typeChange(e: Select2UpdateEvent): void {
    if (this.type != e.value) {
      this.type = e.value;
    }
  }
  tagsChange(e: string[]): void {
    this.tags = e;
  }
}
