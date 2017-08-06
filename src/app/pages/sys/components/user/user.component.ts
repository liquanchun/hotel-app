import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { UserService } from './user.services';

import { UserModel } from '../../models/user.model';

import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService],
})
export class UserComponent implements OnInit, AfterViewInit {

  private isNewUser: boolean;

  private message: string;
  private selectedUser: any;

  private users: any;

  private userForm: FormGroup;
  private userid: AbstractControl;
  private username: AbstractControl;
  private mobile: AbstractControl;
  private weixin: AbstractControl;
  private email: AbstractControl;
  private password: AbstractControl;
  private isvalid: AbstractControl;

  private submitted: boolean = false;
  private editUser: any;
  private roles: any;

  private selectVal: any = [];

  constructor(
    private _state: GlobalState,
    private userService: UserService,
    fb: FormBuilder) {

    this.userForm = fb.group({
      'userid': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'weixin': [''],
      'email': [''],
      'isvalid': [''],
      'roleids': [''],
    });

    this.userid = this.userForm.controls['userid'];
    this.username = this.userForm.controls['username'];
    this.mobile = this.userForm.controls['mobile'];
    this.weixin = this.userForm.controls['weixin'];
    this.email = this.userForm.controls['email'];
    this.password = this.userForm.controls['password'];
    this.isvalid = this.userForm.controls['isvalid'];

    this._state.subscribe('role.dataChanged', (roles) => {
      this.roles = roles;
    });
    this._state.subscribe('role.selectedChanged', (role) => {
      this.users = _.filter(this.users, function (o) { return o['ruleIds'].indexOf(role.id) > -1; });
    });
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    const that = this;
    this.userService.getUsers().then(function (users) {
      that.users = users;
    });
  }

  ngAfterViewInit() {
    const that = this;
    jQuery('.app-sys-user tbody tr td').click(function (e) {
      e.preventDefault();
      jQuery(this).parent().parent().children('tr').children('td').removeClass('selectedcolor');
      jQuery(this).parent().children('td').addClass('selectedcolor');
    });
  }

  onTdClicked(item) {
    this.selectedUser = {
      id: item.id,
      userId: item.userId,
      userName: item.userName,
    };
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    const that = this;
    if (this.userForm.valid) {
      // your code goes here
      console.log(values);
      values['roleids'] = this.selectVal.toString();
      this.userService.create(values).then(function (user) {
        that.users.push(user);
      });
      // sessionStorage.setItem('userId', this.userId.value);
    }
  }

  onNewUser() {
    this.isNewUser = true;
  }
  onBack() {
    this.isNewUser = false;
  }
  // 删除选择的用户
  onDeleteUser(content) {
    const that = this;
    const confirm = {
      message: `${that.selectedUser.userName}用户`,
      callback: () => {
        that.userService.delete(that.selectedUser.id).then(() => {
          _.remove(that.users, r => r['Id'] === that.selectedUser.id);
          that.selectedUser = null;
        });
      },
    };

    that._state.notifyDataChanged('delete.confirm', confirm);
  }

  onCheck(id, event) {
    if (_.indexOf(this.selectVal, id) > -1) {
      _.remove(this.selectVal, function (n) {
        return n === id;
      });
    } else {
      this.selectVal.push(id);
    }
  }
}
