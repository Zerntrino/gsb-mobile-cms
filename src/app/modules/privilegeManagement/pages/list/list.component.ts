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
import { Card, CardRef } from 'src/app/core/models/card.model';
import { Installment } from 'src/app/core/models/parameter.model';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-privilege-management-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  id = 0;

  refs: CardRef[] = [];
  cards: Card[] = [];

  typeOption: Select2Option[] = [
    { value: '', label: 'กรุณาเลือก', disabled: true },
  ];

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    referenceCode: new FormControl<Select2Value>('', [Validators.required]),
    tags: new FormControl<string[]>([]),
    imageUrl: new FormControl(''),
    referenceId: new FormControl(0),
  });
  imageBase64 = '';
  image: File | null = null;
  fileErrorId = 0;
  fileError = '';

  editorConfig = this.utilsService.editorConfig;

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private cardService: CardService,
    private utilsService: UtilsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchRef();
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

    this.submitForm.get('name')?.disable();
  }

  fetchRef(): void {
    let params = new HttpParams();
    this.cardService.getRef(params).subscribe(
      (response) => {
        const refs = response.data as CardRef[];
        console.log(refs);
        this.refs = refs;
        this.typeOption = [];
        this.typeOption = this.typeOption.concat(
          refs.map((r) => {
            return {
              value: r.referenceCode,
              label: r.referenceCode,
            } as Select2Option;
          })
        );
      },
      (error) => {}
    );
  }

  selectCard(card?: Card): void {
    this.id = card?.id || 0;

    this.submitForm.setValue({
      name: card?.name || '',
      description: card?.description || '',
      referenceCode: card?.referenceCode || '',
      tags: card?.tags || [],
      imageUrl: card?.imageUrl || '',
      referenceId: card?.referenceId || 0,
    });
    this.imageBase64 = '';
  }

  refChange(event: Select2UpdateEvent): void {
    const ref = this.refs.find((r) => r.referenceCode == event.value);
    if (ref) {
      this.submitForm.get('name')?.setValue(ref?.name || '');
      this.submitForm.get('referenceCode')?.setValue(ref?.referenceCode || '');
      this.submitForm.get('referenceId')?.setValue(ref?.id || 0);
    } else {
    }
  }

  async onSubmit() {
    if (this.imageBase64) {
      const data = new FormData();
      data.append('file', this.image as File);
      const upload = await this.cardService.upload(data).toPromise();
      this.submitForm.get('imageUrl')?.setValue(upload?.data || '');
    }

    if (this.id == 0) {
      this.cardService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');

          this.fetch();
          this.fetchRef();

          // clear
          this.selectCard(this.cards[0] || {});
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
    } else {
      this.cardService.update(this.id, this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');

          this.fetch();
          this.fetchRef();
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
    }
  }

  inputFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);
    if (file) {
      if (
        file.size > 2000000 ||
        !['jpg', 'jpeg', 'png', 'gif'].includes(
          file.name.split('.')?.pop()?.toLocaleLowerCase() || ''
        )
      ) {
        this.fileErrorId = Math.random();
        this.fileError =
          'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบชนิดและขนาดไฟล์อีกครั้ง';
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width != 492 || img.height != 300) {
            this.fileErrorId = Math.random();
            this.fileError =
              'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.imageBase64 = reader.result?.toString() || '';
          this.image = file;
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }
  tagsChange(e: string[]): void {
    this.submitForm.get('tags')?.setValue(e);
  }
}
