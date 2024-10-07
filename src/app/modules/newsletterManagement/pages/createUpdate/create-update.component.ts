import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Select2Option,
  Select2UpdateEvent,
  Select2Value,
} from 'ng-select2-component';
import dayjs from 'dayjs';
import { BannerService } from 'src/app/core/services/banner.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilsService } from 'src/app/core/services/utils.service';
import { NewsLetterService } from 'src/app/core/services/newsletter.service';
import { NewsLetter } from 'src/app/core/models/newsletter.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/models/card.model';

@Component({
  selector: 'app-banner-management-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  id = 'create';
  navItems = [
    { title: 'จัดการการแจ้งเตือน', to: '/newsletter-management' },
    { title: 'สร้างการแจ้งเตือน', to: '' },
  ];
  mode = 'edit';

  today = new Date();
  submitForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    sendNotificationDate: new FormControl(''),
    sendNotificationTime: new FormControl(''),
    condition: new FormControl(''),
    isActive: new FormControl(true),
    isSendNotification: new FormControl(true),
    linkUrl: new FormControl(''),
    conditionId: new FormControl<number[]>([]),
  });

  cards: Card[] = [];
  cardIds: number[] = [];
  editorConfig = this.utilsService.editorConfig;

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private newsLetterService: NewsLetterService,
    private cardService: CardService,
    private toastService: ToastService,
    private utilsService: UtilsService
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
          ? 'สร้างการแจ้งเตือน'
          : this.mode == 'view'
          ? 'รายละเอียดการแจ้งเตือน'
          : 'แก้ไขการแจ้งเตือน';
    });
  }

  ngOnInit(): void {
    this.fetch();
    this.fetchCards();
  }

  fetchCards() {
    this.cardService.getList().subscribe(
      (response) => {
        const res = response.data as Card[];
        this.cards = res;
        this.cardIds = res.map((c) => c.id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetch(): void {
    if (this.id != 'create') {
      this.newsLetterService.get(this.id).subscribe(
        (response) => {
          const res = response.data as NewsLetter;

          this.submitForm.setValue({
            subject: res.subject,
            description: res.description,
            sendNotificationDate: res.sendNotificationDate,
            sendNotificationTime: res.sendNotificationDate,
            condition: res.condition || null,
            isActive: res.isActive,
            isSendNotification: res.isSendNotification,
            linkUrl: res.linkUrl,
            conditionId: res.conditionId || null,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  dateFormat(d: string): string {
    const date = dayjs(d);
    return date.locale('th-th').format('DD/MM/BBBB');
  }

  updateCondition(event: boolean, id: number) {
    if (event)
      this.submitForm
        .get('conditionId')
        ?.setValue(
          this.submitForm.get('conditionId')?.value?.concat([id]) || []
        );
    else {
      const filter = this.submitForm
        .get('conditionId')
        ?.value?.filter((c) => c != id);

      this.submitForm.get('conditionId')?.setValue(filter || []);
    }
  }

  async onSubmit() {
    const raw = this.submitForm.getRawValue();
    if (raw.sendNotificationDate && raw.sendNotificationTime) {
      const date = new Date(raw.sendNotificationDate);
      const time = new Date(raw.sendNotificationTime);
      date.setHours(time.getHours() + 7);
      date.setMinutes(time.getMinutes());

      raw.sendNotificationDate = date.toISOString();
      raw.sendNotificationTime = null;
    }

    if (this.id == 'create') {
      this.newsLetterService.create(raw).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/newsletter-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
    } else {
      this.newsLetterService.update(parseInt(this.id), raw).subscribe(
        (response) => {
          this.toastService.add('success', 'ทำรายการสำเร็จ');
          this.router.navigate(['/newsletter-management']);
        },
        (error) => {
          console.log(error);
          this.toastService.add('error', error);
        }
      );
    }
  }

  edit() {
    this.mode = 'edit';
    this.submitForm.enable();
    this.editorConfig.editable = true;
    this.navItems[1].title = 'แก้ไขโปรโมชัน';
  }
}
