import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
})
export class Dashboard {

  constructor(private _router: Router) {
    //Check user is login
    if (!sessionStorage.getItem('userId')) {
      this._router.navigate(['login']);
    }
  }

}
