import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { GlobalState } from '../../../global.state';
import { RoleComponent } from '../components/role/role.component';
import { UserComponent } from '../components/user/user.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit, AfterViewInit {

  constructor(
    private _state: GlobalState,
  ) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }
  onMessage(event) {
    const msg = event.msg;
    if (event.type == 'warning') {
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "warning", time: new Date().getTime() });
    }
    if (event.type == 'success') {
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
    }
    if (event.type == 'error') {
      
    }
  }
}
