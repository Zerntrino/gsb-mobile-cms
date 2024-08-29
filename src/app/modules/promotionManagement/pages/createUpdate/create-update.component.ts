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
import { Promotion } from 'src/app/core/models/promotion.model';

@Component({
  selector: 'app-promotion-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการโปรโมชัน', to: '/promotion-management' },
    { title: 'สร้างโปรโมชัน', to: '' },
  ];
  mode = 'edit';

  submitForm = new FormGroup({
    categoryId: new FormControl(0),
    isActive: new FormControl(true),
    name: new FormControl(''), // [Validators.required]
    description: new FormControl(''),
    aboutIt: new FormControl<string[]>([]),
    startDate: new FormControl('', []),
    endDate: new FormControl('', []),
    isNotification: new FormControl(true),
    typeId: new FormControl(0),
    shopId: new FormControl(0),
    mccCode: new FormControl<string[]>([]),
    generateType: new FormControl(0),
    prefixCode: new FormControl(''),
    importCode: new FormControl<string[]>([]),
    limit: new FormControl(0),
    limitPerMonth: new FormControl(0),
    limitPerCardMonth: new FormControl(0),
    limitPerCardDay: new FormControl(0),
    cardId: new FormControl<number[]>([]),
    coverImageUrl: new FormControl(''),
    imageUrl: new FormControl<string[]>([]),
  });

  coverImageBase64 = '';
  imageBase64: string[] = [];
  fileErrorId = 0;
  fileError = '';

  categoryOption: Select2Option[] = [];

  editorConfig = {
    ...this.utilsService.editorConfig,
  };

  promotionType: Select2Value = '';
  promotionTypeOption: Select2Option[] = [
    {
      value: 1,
      label: 'โปรโมชันลงทะเบียนรับสิทธิ์',
    },
    {
      value: 2,
      label: 'โปรโมชั่นไม่ลงทะเบียนรับสิทธิ์',
    },
    {
      value: 3,
      label: 'โปรโมชั่นลงทะเบียนรับสิทธิ์',
    },
    {
      value: 4,
      label: 'โปรโมชั่นลงทะเบียนรับสิทธิ์ (แสดงโค้ด)',
    },
  ];

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

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private promotionService: PromotionService,
    private categoryService: CategoryService,
    private partnerService: PartnerService,
    private parameterService: ParameterService,
    private cardService: CardService,
    private utilsService: UtilsService,
    private toastService: ToastService
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

  ngOnInit(): void {
    this.fetch();
    this.fetchCategory();
    this.fetchShop();
    this.fetchMcc();
    this.fetchCard();
  }

  fetch(): void {
    if (this.id != 'create') {
      this.promotionService.get(this.id).subscribe(
        (response) => {
          const res = response.data as Promotion;
          this.submitForm.setValue({
            categoryId: res.category_id,
            isActive: res.is_active,
            name: res.name,
            description: res.description,
            aboutIt: res.about_it,
            startDate: res.start_date,
            endDate: res.end_date,
            isNotification: res.is_notification,
            typeId: res.type_id,
            shopId: res.shop_id,
            mccCode: res.mcc_code,
            generateType: res.generate_type,
            prefixCode: res.prefix_code,
            importCode: res.import_code || [],
            limit: res.limit,
            limitPerMonth: res.limit_per_month,
            limitPerCardMonth: res.limit_per_card_month,
            limitPerCardDay: res.limit_per_card_day,
            cardId: res.card_id,
            coverImageUrl: res.cover_url,
            imageUrl: res.image_url,
          });

          this.imageBase64 = res.imageUrl;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  fetchCategory(): void {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    this.categoryService.getList(params).subscribe(
      (response) => {
        const categories = response.data as Category[];
        this.categoryOption = this.categoryOption.concat(
          categories.map((c) => {
            return { value: c.id, label: c.name } as Select2Option;
          })
        );
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
        const partners = response.data as Partner[];
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

  fetchCard(): void {
    let params = new HttpParams().append('page', 1).append('pageSize', 100);
    this.cardService.getList(params).subscribe(
      (response) => {
        this.cards = response.data as Card[];
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
    if (this.submitForm.get('categoryId')?.value != e.value) {
      this.submitForm.get('categoryId')?.setValue(e.value as number);
    }
  }
  promotionTypeChange(e: Select2UpdateEvent): void {
    if (this.submitForm.get('typeId')?.value != e.value) {
      this.submitForm.get('typeId')?.setValue(e.value as number);
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
    if (this.submitForm.get('generateType')?.value != e.value) {
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
          if (img.width != 1179 || img.height != 834) {
            this.fileErrorId = Math.random();
            this.fileError =
              'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.coverImageBase64 = reader.result?.toString() || '';
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
          if (img.width != 1179 || img.height != 834) {
            this.fileErrorId = Math.random();
            this.fileError =
              'ไม่สามารถอัพโหลดไฟล์ได้ <br/> กรุณาตรวจสอบขนาด ความกวาง x ความสูง อีกครั้ง';
            return;
          }

          this.imageBase64.push(reader.result?.toString() || '');
        };
        img.src = URL.createObjectURL(file);
      };
    }
  }

  removeImg(index: number): void {
    this.imageBase64 = this.imageBase64.filter((item, i) => i != index);
  }

  async onSubmit() {
    if (this.coverImageBase64) {
      const upload = await this.promotionService
        .upload({
          imageBase64: this.coverImageBase64,
        })
        .toPromise();
      this.submitForm.get('coverImageUrl')?.setValue(upload?.data || '');
    }

    if (this.imageBase64?.length) {
      await this.imageBase64.forEach(async (img, i) => {
        if (!img.startsWith('http')) {
          const upload = await this.promotionService
            .upload({
              imageBase64: img,
            })
            .toPromise();

          this.imageBase64[i] = upload?.data || '';
        }
      });
      this.submitForm.get('imageUrl')?.setValue(this.imageBase64);
    }

    if (this.id == 'create') {
      this.promotionService.create(this.submitForm.getRawValue()).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/promotion-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
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
            this.toastService.add('error', error);
          }
        );
    }
  }
  createCategoryClick() {
    this.showDetail = 0;
  }
  createCategorySuccess() {
    this.showDetail = -1;
    this.fetchCategory();
  }

  edit() {
    this.mode = 'edit';
    this.submitForm.enable();
    this.editorConfig.editable = true;
    this.navItems[1].title = 'แก้ไขโปรโมชัน';
  }
}
