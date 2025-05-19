import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
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
import { UtilsService } from 'src/app/core/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PromotionService } from 'src/app/core/services/promotion.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { PartnerService } from 'src/app/core/services/partner.service';
import { Partner } from 'src/app/core/models/partner.model';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { MCC } from 'src/app/core/models/parameter.model';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/models/card.model';
import { Promotion, PromotionType } from 'src/app/core/models/promotion.model';
import * as XLSX from 'xlsx';
import { isArray } from 'lodash';
import { ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { RouteHistoryService } from 'src/app/core/services/history';

@Component({
  selector: 'app-promotion-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  @ViewChild('inputCode', { static: false })
  inputCode: ElementRef | undefined;

  id = 'create';
  navItems = [
    { title: 'จัดการโปรโมชัน', to: '/promotion-management' },
    { title: 'สร้างโปรโมชัน', to: '' },
  ];
  mode = 'edit';

  submitForm = new FormGroup({
    categoryId: new FormControl(0, [Validators.required]),
    isActive: new FormControl(true),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    aboutIt: new FormControl<string[]>([]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    isNotification: new FormControl(true),
    typeId: new FormControl(0, [Validators.required]),
    shopId: new FormControl(0),
    mccCode: new FormControl<string[]>([]),
    generateType: new FormControl(0),
    prefixCode: new FormControl(''),
    importCode: new FormControl<string[]>([]),
    importCodeFileName: new FormControl<string[] | string>([]),
    limit: new FormControl(0),
    limitPerMonth: new FormControl(0),
    limitPerCardMonth: new FormControl(0),
    limitPerCardDay: new FormControl(0),
    cardId: new FormControl<number[]>([], [Validators.required]),
    coverImageUrl: new FormControl(''),
    imageUrl: new FormControl<string[]>([]),
  });

  coverImageBase64 = '';
  coverImage: File | null = null;
  imageBase64: string[] = [];
  image: File[] = [];
  fileErrorId = 0;
  fileError = '';
  fileCodeName: string | null = null;
  fileCodeLimitOrg = 0;

  categoryOption: Select2Option[] = [];

  editorConfig = {
    ...this.utilsService.editorConfig,
  };

  promotionType: Select2Value = '';
  promotionTypeOption: Select2Option[] = [];

  shopOption: Select2Option[] = [];
  mccOption: Select2Option[] = [];
  codeType: Select2Value = '';
  codeTypeOption: Select2Option[] = [
    { value: 1, label: 'Generate code' },
    { value: 2, label: 'Import code' },
  ];

  cards: Card[] = [];
  cardIds: number[] = [];

  showDetail = -1;

  currentDate = new Date(
    new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0)
  ).toISOString();

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private promotionService: PromotionService,
    private categoryService: CategoryService,
    private partnerService: PartnerService,
    private parameterService: ParameterService,
    private cardService: CardService,
    private utilsService: UtilsService,
    private toastService: ToastService,
    private _location: Location,
    private routeHistory: RouteHistoryService
  ) {
    this.id = activatedRoute.snapshot.params['id'];

    activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'view') {
        this.mode = 'view';
        this.submitForm.disable();
        this.editorConfig.editable = false;
      }

      this.navItems[1].title =
        this.id == 'create'
          ? 'สร้างโปรโมชัน'
          : this.mode == 'view'
          ? 'รายละเอียดโปรโมชัน'
          : 'แก้ไขโปรโมชัน';
    });
  }

  async ngOnInit() {
    await this.fetchCategory();
    this.fetchType();
    this.fetchShop();
    this.fetchMcc();
    await this.fetchCard();
    this.fetch();
  }

  fetch(): void {
    if (this.id != 'create') {
      this.promotionService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Promotion;
          this.submitForm.setValue({
            categoryId: res.categoryId,
            isActive: res.isActive,
            name: res.name,
            description: res.description,
            aboutIt: res.aboutIt,
            startDate: res.startDate,
            endDate: res.endDate,
            isNotification: res.isNotification,
            typeId: res.typeId,
            shopId: res.shopId,
            mccCode: res.mccCode,
            generateType: res.generateType,
            prefixCode: res.prefixCode,
            importCode: res.importCode || [],
            importCodeFileName:
              (isArray(res.importCodeFileName)
                ? res.importCodeFileName
                : [res.importCodeFileName]) || [],
            limit: res.limit,
            limitPerMonth: res.limitPerMonth,
            limitPerCardMonth: res.limitPerCardMonth,
            limitPerCardDay: res.limitPerCardDay,
            cardId: res.cardId,
            coverImageUrl: res.coverUrl,
            imageUrl: res.imageUrl,
          });

          if (res?.importCodeFileName?.length)
            this.submitForm.get('limit')?.disable();

          this.fileCodeLimitOrg = res.importCode?.length || res.limit || 0;

          this.imageBase64 = res.imageUrl;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async fetchType() {
    await this.promotionService.getTypes().subscribe(
      (response) => {
        const types = response.data as PromotionType[];
        this.promotionTypeOption = types.map((t) => {
          return { value: t.id, label: t.name } as Select2Option;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async fetchCategory() {
    let params = new HttpParams()
      .append('page', 1)
      .append('pageSize', 100)
      .append('status', true);
    await this.categoryService.getList(params).subscribe(
      (response) => {
        const categories = (response.data as Category[]).filter(
          (c) => c.isActive
        );
        const cs = categories
          .filter((c) => c.isPromotion)
          .map((c) => {
            return { value: c.id, label: c.name } as Select2Option;
          });
        this.categoryOption = cs;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchShop(): void {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    this.partnerService.getList(params).subscribe(
      (response) => {
        const partners = (response.data as Partner[]).filter((c) => c.isActive);
        this.shopOption = partners.map((c) => {
          return { value: c.id, label: c.name } as Select2Option;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchMcc(): void {
    this.parameterService.getMCCList().subscribe(
      (response) => {
        const mccs = response.data as MCC[];
        this.mccOption = mccs.map((item) => {
          return {
            value: item.code,
            label: `${item.code} : ${item.name}`,
          } as Select2Option;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async fetchCard() {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    await this.cardService.getList(params).subscribe(
      (response) => {
        this.cards = (response.data as Card[]).filter((c) => c.isActive);
        this.cardIds = this.cards.map((c) => c.id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  categoryChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('categoryId')?.value != e.value && e.value) {
      this.submitForm.get('categoryId')?.setValue(e.value as number);
    }
  }
  promotionTypeChange(e: Select2UpdateEvent): void {
    if (e.value && this.submitForm.get('typeId')?.value != e.value) {
      this.submitForm.get('typeId')?.setValue(e.value as number);

      this.submitForm.get('shopId')?.setValidators([]);
      this.submitForm.get('mccCode')?.setValidators([]);
      this.submitForm.get('generateType')?.setValidators([]);
      this.submitForm.get('limit')?.setValidators([]);
      this.submitForm.get('limitPerMonth')?.setValidators([]);
      this.submitForm.get('limitPerCardMonth')?.setValidators([]);
      this.submitForm.get('limitPerCardDay')?.setValidators([]);

      console.log(e.value);

      if (e.value == 1) {
        this.submitForm.get('shopId')?.setValidators([Validators.required]);
        this.submitForm.get('mccCode')?.setValidators([Validators.required]);
        this.submitForm.get('limit')?.setValidators([Validators.required]);
        this.submitForm
          .get('limitPerMonth')
          ?.setValidators([Validators.required]);
        this.submitForm
          .get('limitPerCardMonth')
          ?.setValidators([Validators.required]);
        this.submitForm
          .get('limitPerCardDay')
          ?.setValidators([Validators.required]);
      } else if (e.value == 2) {
        this.submitForm.get('shopId')?.setValidators([Validators.required]);
        this.submitForm.get('mccCode')?.setValidators([Validators.required]);
        this.submitForm
          .get('generateType')
          ?.setValidators([Validators.required]);
        this.submitForm.get('limit')?.setValidators([Validators.required]);
        this.submitForm
          .get('limitPerMonth')
          ?.setValidators([Validators.required]);
        this.submitForm
          .get('limitPerCardMonth')
          ?.setValidators([Validators.required]);
        this.submitForm
          .get('limitPerCardDay')
          ?.setValidators([Validators.required]);
      } else if (e.value == 3) {
        this.submitForm.get('shopId')?.setValidators([Validators.required]);
        this.submitForm.get('mccCode')?.setValidators([Validators.required]);
      }

      console.log(this.submitForm);
    }
  }
  tagChange(e: string[]): void {
    this.submitForm.get('aboutIt')?.setValue(e);
  }
  shopChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('shopId')?.value != e.value) {
      this.submitForm.get('shopId')?.setValue(e.value as number);
    }
  }
  mccChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('mccCode')?.value != e.value) {
      this.submitForm.get('mccCode')?.setValue((e.value as string[]) || []);
    }
  }
  generateTypeChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('generateType')?.value != e.value && e.value) {
      this.submitForm.get('generateType')?.setValue(e.value as number);
    }
  }

  updateCard(event: boolean, id: number) {
    if (event)
      this.submitForm
        .get('cardId')
        ?.setValue(this.submitForm.get('cardId')?.value?.concat([id]) || []);
    else {
      const filter = this.submitForm
        .get('cardId')
        ?.value?.filter((c) => c != id);

      this.submitForm.get('cardId')?.setValue(filter || []);
    }
  }

  inputFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);
    if (file) {
      if (
        file.size > 2000000 ||
        !['png'].includes(
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
          if (img.width != 1179 || img.height != 834) {
            this.fileErrorId = Math.random();
            this.fileError =
              'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.coverImageBase64 = reader.result?.toString() || '';
          this.coverImage = file;
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  inputFile2Change(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);
    if (file) {
      if (
        file.size > 2000000 ||
        !['png'].includes(
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
          if (img.width != 1179 || img.height != 834) {
            this.fileErrorId = Math.random();
            this.fileError =
              'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.imageBase64.push(reader.result?.toString() || '');
          this.image.push(file);
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  removeImg(index: number): void {
    this.imageBase64 = this.imageBase64.filter((item, i) => i != index);
    this.image = this.image.filter((item, i) => i != index);
  }

  inputCodeChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(0);
    if (file) {
      if (
        file.size > 2000000 ||
        !['xls', 'xlsx'].includes(
          file.name.split('.')?.pop()?.toLocaleLowerCase() || ''
        )
      ) {
        this.fileErrorId = Math.random();
        this.fileError =
          'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบชนิดและขนาดไฟล์อีกครั้ง';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        interface Code {
          code: string;
        }

        var codes = [];
        for (let c of excelData as Code[]) {
          if (c?.code) codes.push(`${c?.code || ''}`);
        }

        this.submitForm.get('importCode')?.setValue(codes);
        this.submitForm
          .get('limit')
          ?.setValue(this.fileCodeLimitOrg + codes.length);
        this.submitForm.get('limit')?.disable();
      };
      reader.readAsBinaryString(file);

      this.fileCodeName = file.name;
    }
  }

  removeFileCode() {
    this.submitForm.get('importCode')?.setValue([]);
    this.submitForm.get('limit')?.setValue(this.fileCodeLimitOrg);
    this.fileCodeName = null;

    if (this.inputCode) this.inputCode.nativeElement.value = '';
  }

  async onSubmit() {
    if (this.submitForm.get('startDate')?.value) {
      const date = new Date(this.submitForm.get('startDate')?.value || '');
      date.setHours(date.getHours());
      this.submitForm.get('startDate')?.setValue(date.toISOString());
    }
    if (this.submitForm.get('endDate')?.value) {
      const date = new Date(this.submitForm.get('endDate')?.value || '');
      date.setHours(date.getHours());
      this.submitForm.get('endDate')?.setValue(date.toISOString());
    }

    if (this.coverImageBase64) {
      const data = new FormData();
      data.append('file', this.coverImage as File);
      const upload = await this.promotionService.upload(data).toPromise();
      this.submitForm.get('coverImageUrl')?.setValue(upload?.data || '');
    }

    if (this.imageBase64?.length) {
      for (const i of this.imageBase64.keys()) {
        if (!this.imageBase64[i].startsWith('http')) {
          const data = new FormData();
          data.append('file', this.image[i] as File);
          const upload = await this.promotionService.upload(data).toPromise();
          this.imageBase64[i] = upload?.data || '';
        }
      }
      this.submitForm.get('imageUrl')?.setValue(this.imageBase64);
    }

    if (this.fileCodeName) {
      this.submitForm.get('importCodeFileName')?.setValue(this.fileCodeName);
    } else {
      this.submitForm.get('importCodeFileName')?.setValue('');
    }

    if (this.id == 'create') {
      this.promotionService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/promotion-management']);
        },
        (error) => {
          console.log(error);
          // this.toastService.add('error', error);
          this.toastService.add('error', 'ไม่สามารถทำรายการได้ ');
        }
      );
    } else {
      this.promotionService
        .update(parseInt(this.id), this.submitForm.getRawValue())
        .subscribe(
          (response) => {
            this.toastService.add('success', 'ทำรายการสำเร็จ');
            this.router.navigate(['/promotion-management']);
          },
          (error) => {
            console.log(error);
            // this.toastService.add('error', error);
            this.toastService.add('error', 'ไม่สามารถทำรายการได้ ');
          }
        );
    }
  }
  createCategoryClick() {
    this.showDetail = 0;
  }
  createCategorySuccess() {
    this.showDetail = -1;
    setTimeout(() => {
      this.fetchCategory();
    }, 200);
  }

  edit() {
    this.mode = 'edit';
    this.submitForm.enable();
    this.editorConfig.editable = true;
    this.navItems[1].title = 'แก้ไขโปรโมชัน';
  }
  stringify(o: any): string {
    return JSON.stringify(o);
  }

  dateBeforeNow(d: string | null | undefined): boolean {
    const date = dayjs(d);
    const c = dayjs(this.currentDate);
    const diff = date.diff(c, 'minute');
    return diff <= 0;
  }

  startDateFilter(e: Date | null): boolean {
    const date = dayjs(e);
    const c = dayjs();
    const diff = date.diff(c, 'day');
    return diff >= 0;
  }

  endDateFilter = (e: Date | null): boolean => {
    const date = dayjs(e);
    var c = dayjs();
    var diff = 0;
    if (this.submitForm?.get('startDate')?.value) {
      c = dayjs(this.submitForm.get('startDate')?.value);
      diff = date.diff(c, 'day');
    } else {
      diff = date.diff(c, 'day');
    }
    return diff >= 0;
  };

  back() {
    this.router.navigateByUrl(
      this.routeHistory.getPreviousUrl() || '/promotion-management'
    );
  }
}
