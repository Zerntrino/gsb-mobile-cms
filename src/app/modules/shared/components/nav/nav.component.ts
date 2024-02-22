import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
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
