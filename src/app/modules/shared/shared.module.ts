import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { Error404Component } from './pages/error404/error404.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';
import { TabComponent } from './components/tab/tab.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { Select2Module } from 'ng-select2-component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioboxComponent } from './components/radiobox/rediobox.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { LoadingComponent } from './components/loading/loading.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagComponent } from './components/tag/tag.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { AlertComponent } from './components/alert/alert.component';
import { CreateUpdateCategoryDialogComponent } from '../categoryManagement/dialogs/create-update-dialog/create-update-dialog.component';
import { CreateUpdateadminDialogComponent } from '../adminManagement/dialogs/create-update-dialog/create-update-dialog.component';

@NgModule({
  declarations: [
    Error404Component,
    LayoutComponent,
    NavComponent,
    TabComponent,
    DropdownComponent,
    PaginationComponent,
    CheckboxComponent,
    RadioboxComponent,
    ToggleComponent,
    TagComponent,
    ConfirmComponent,
    AlertComponent,
    LoadingComponent,
    CreateUpdateCategoryDialogComponent,
    CreateUpdateadminDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    Select2Module,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DragDropModule,
    AngularEditorModule,
  ],
  exports: [
    NavComponent,
    TabComponent,
    DropdownComponent,
    PaginationComponent,
    Select2Module,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DragDropModule,
    CheckboxComponent,
    RadioboxComponent,
    ToggleComponent,
    TagComponent,
    ConfirmComponent,
    AlertComponent,
    LoadingComponent,
    CreateUpdateCategoryDialogComponent,
    CreateUpdateadminDialogComponent,
    AngularEditorModule,
  ],
})
export class SharedModule {}
