import { Component, OnDestroy, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
})
export class Error404Component implements OnDestroy, OnInit {
  counter = 5;
  timer: any;
  // constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      // this.counter--;
      // if (this.counter === 0) {
      //   this.authService.logout();
      //   clearInterval(this.timer);
      // }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
