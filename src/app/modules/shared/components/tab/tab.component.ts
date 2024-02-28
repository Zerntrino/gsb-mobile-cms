import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent {
  url?: string;

  @Input() title!: string;
  @Input() items: NavItem[] = [];

  constructor(private router: Router) {
    console.log(this.router.url);
    console.log(this.title);
  }
}

export interface NavItem {
  title: string;
  to: string;
}
