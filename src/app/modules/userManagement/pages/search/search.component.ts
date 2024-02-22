import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(13)]),
  });
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const id = this.searchForm.get('id')?.value || '';
    console.log(id);

    this.router.navigate([`/user-management/${id}`]);
  }
}
