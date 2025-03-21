import { Injectable } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  editorConfig: AngularEditorConfig = {
    editable: true,
    minHeight: '320px',
    translate: 'yes',
    sanitize: false,
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
        // 'textColor',
        // 'backgroundColor',
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
}
