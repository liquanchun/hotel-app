import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { UserService } from './user.services';

import { UserModel } from '../../models/user.model';

import { GlobalState } from '../../../../global.state';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

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

  private smartTableData: any;

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

  // Default selection
  optionsModel: number[] = [1, 2];

  // Settings configuration
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };

  // Text configuration
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  // Labels / Parents
  myOptions: IMultiSelectOption[] = [
    { id: 1, name: 'Car brands', isLabel: true },
    { id: 2, name: 'Volvo', parentId: 1 },
    { id: 3, name: 'Honda', parentId: 1 },
    { id: 4, name: 'BMW', parentId: 1 },
    { id: 5, name: 'Colors', isLabel: true },
    { id: 6, name: 'Blue', parentId: 5 },
    { id: 7, name: 'Red', parentId: 5 },
    { id: 8, name: 'White', parentId: 5 }
  ];

  constructor(
    private _state: GlobalState,
    private modalService: NgbModal,
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


  }

  ngOnInit() {
    this.smartTableData = [
      {
        id: 1,
        firstName: 'Mark',
        lastName: 'Otto',
        username: '@mdo',
        email: 'mdo@gmail.com',
        age: '28'
      },
      {
        id: 2,
        firstName: 'Jacob',
        lastName: 'Thornton',
        username: '@fat',
        email: 'fat@yandex.ru',
        age: '45'
      }];

    this.myOptions = [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
    ];
  }

  ngAfterViewInit() {
    const that = this;
    jQuery('.app-sys-user tbody tr td').click(function (e) {
      e.preventDefault();
      jQuery(this).parent().parent().children('tr').children('td').removeClass('selectedcolor');
      jQuery(this).parent().children('td').addClass('selectedcolor');
      that.selectedUser = {
        user_id: jQuery(this).parent().children('td:eq(1)').text(),
        user_name: jQuery(this).parent().children('td:eq(2)').text()
      };
    });
    //$('#example-getting-started').multiselect();
    //$('.ui.dropdown').dropdown();
  }

  onTdClicked(item) {
    this.selectedUser = {
      user_id: item.firstName,
      user_name: item.lastName
    };
  }

  onSubmit(values: Object): void {
    this.submitted = true;

    if (this.userForm.valid) {
      // your code goes here
      console.log(values);
      console.log({
        user_id: this.userid.value,
        user_name: this.username.value,
        mobile: this.mobile.value,
        weixin: this.weixin.value,
        email: this.email.value,
        pwd: this.password.value,
        isvalid: this.isvalid.value,
      });
      // sessionStorage.setItem('userId', this.userId.value);
    }
  }

  onNewUser() {
    this.isNewUser = true;
  }

  onSaveUser(event) {
    console.log(this.editUser);
    this.isNewUser = false;
  }

  onBack() {
    this.isNewUser = false;
  }
  // 删除选择的用户
  onDeleteUser(content) {
    let that = this;
    this.onDelCallBack(content, `${this.selectedUser.user_name}用户`, function () {
      _.remove(that.smartTableData, r => r['firstName'] === that.selectedUser.user_id);
      that.selectedUser = null;
    });
  }

  onDelCallBack(content, keystring, callback) {
    this.message = `你确定要删除${keystring}吗？`;
    this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: false }).result.then((result) => {
      if (result === 'yes') {
        callback();
      }
    }, (reason) => { });
  }

  onChange() {
    console.log(this.optionsModel);
  }
}
