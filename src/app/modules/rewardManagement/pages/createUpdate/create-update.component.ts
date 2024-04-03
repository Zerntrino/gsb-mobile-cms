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

@Component({
  selector: 'app-reward-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการรีวอร์ด', to: '' },
    { title: 'สร้างรีวอร์ด', to: '' },
  ];

  category: Select2Value = '';
  categoryOption: Select2Option[] = [
    { value: 'ชอปปิง', label: 'ชอปปิง' },
    { value: 'ร้านอาหาร', label: 'ร้านอาหาร' },
    { value: 'ท่องเที่ยว', label: 'ท่องเที่ยว' },
  ];
  tags: string[] = ['ชอปปิง', 'ร้านอาหาร', 'ท่องเที่ยว'];

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

  dt1 = '';
  dt2 = '';

  promotionType: Select2Value = '';
  promotionTypeOption: Select2Option[] = [
    {
      value: 'โปรโมชันลงทะเบียนรับสิทธิ์',
      label: 'โปรโมชันลงทะเบียนรับสิทธิ์',
    },
  ];

  brand: Select2Value = '';
  brandOption: Select2Option[] = [{ value: 'SF', label: 'SF' }];

  mccs: string[] = [];
  codeType: Select2Value = '';
  codeTypeOption: Select2Option[] = [
    { value: 'Generate code', label: 'Generate code' },
  ];

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private adService: AdService
  ) {
    this.id = activatedRoute.snapshot.params['id'];
    this.navItems[1].title =
      this.id == 'create' ? 'สร้างรีวอร์ด' : 'แก้ไขรีวอร์ด';
  }

  ngOnInit(): void {
    // this.editor = new Editor();

    this.fetch();
  }

  fetch(): void {
    // this.adService.getList(params).subscribe(
    //   (response) => {
    //     console.log(response.data);
    //     this.list = response.data as Ad[];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  categoryChange(e: Select2UpdateEvent): void {
    if (this.category != e.value) {
      this.category = e.value;
    }
  }
  promotionTypeChange(e: Select2UpdateEvent): void {
    if (this.promotionType != e.value) {
      this.promotionType = e.value;
    }
  }
  tagChange(e: string[]): void {
    this.tags = e;
  }
  brandChange(e: Select2UpdateEvent): void {
    if (this.brand != e.value) {
      this.brand = e.value;
    }
  }
  mccChange(e: string[]): void {
    this.mccs = e;
  }
  codeTypeChange(e: Select2UpdateEvent): void {
    if (this.codeType != e.value) {
      this.codeType = e.value;
    }
  }
}
