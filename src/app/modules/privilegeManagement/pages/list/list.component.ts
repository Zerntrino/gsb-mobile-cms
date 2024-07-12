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

  cards: Card[] = [];

  typeOption: Select2Option[] = [
    { value: '', label: 'กรุณาเลือก', disabled: true },
    { value: 'Visa', label: 'Visa' },
    { value: 'Master Card', label: 'Master Card' },
  ];

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    type: new FormControl<Select2Value>('Visa', [Validators.required]),
    tags: new FormControl<string[]>([]),
    imageUrl: new FormControl(''),
  });
  imageBase64 = '';

  editorConfig = this.utilsService.editorConfig;

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private cardService: CardService,
    private utilsService: UtilsService,
    private toastService: ToastService
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
    this.submitForm.setValue({
      name: card?.name || '',
      description: card?.description || '',
      type: card?.type || '',
      tags: card?.tags || [],
      imageUrl: card?.imageUrl || '',
    });
    this.imageBase64 = '';
  }

  async onSubmit() {
    if (this.imageBase64) {
      const upload = await this.cardService
        .upload({
          imageBase64: this.imageBase64,
        })
        .toPromise();
      this.submitForm.get('imageUrl')?.setValue(upload?.data || '');
    }

    if (this.id == 0) {
      this.cardService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/privilege']);
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
          this.router.navigate(['/privilege']);
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageBase64 = reader.result?.toString() || '';
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
