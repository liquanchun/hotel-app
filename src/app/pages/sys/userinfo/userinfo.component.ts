import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { GlobalState } from '../../../global.state';
import { UserService } from './../../sys/components/user/user.services';

@Component({
  selector: 'app-user-info',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss'],
  providers: [UserService],
})
export class UserInfoComponent implements OnInit, AfterViewInit {

  private user: any = { userId: '', userName: '', weixin: '', mobile: '' };

  constructor(private _userService: UserService,
    private _state: GlobalState
   ) {
  }

  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    this._userService.getUsersById(userId).then((data) => {
      if (!data) {
        const msg = '用户不存在。';
        
      } else {
        this.user = data;
      }
    },
      (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      });
  }

  onUpdate() {
    this._userService.update(this.user.id, this.user).then((data) => {
      const msg = '修改成功。';
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
    },
      (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      });
  }

  ngAfterViewInit() {

  }
}
