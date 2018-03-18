import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { NgbdModalContent } from '../../../modal-content.component'
import * as $ from 'jquery';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { UserService } from './user.services';
import { OrgService } from '../org/org.services';
import { GlobalState } from '../../../global.state';


@Component({
  selector: 'app-staff-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, OrgService],
})
export class UserComponent implements OnInit, AfterViewInit {

  @Input() checkable: boolean = false;
  @Output()
  message = new EventEmitter();

  public loading = false;
  private roles: any = [];
  newSettings;
  settings = {
    pager: {
      perPage: 15
    },
    selectMode: '',
    mode: 'external',
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    hideSubHeader: true,
    columns: {
      name: {
        title: '员工姓名',
        type: 'string',
        filter: false,
      },
      employeeNo: {
        title: '工号',
        type: 'string',
        filter: false,
      },
      mobile: {
        title: '电话',
        type: 'string',
        filter: false,
      },
      webChat: {
        title: '微信',
        type: 'string',
        filter: false,
      },
      idCard: {
        title: '身份证',
        type: 'string',
        filter: false,
      },
      address: {
        title: '住址',
        type: 'string',
        filter: false,
      },
      title: {
        title: '职位',
        type: 'string',
        filter: false,
      },
      orgIdTxt: {
        title: '所属部门',
        type: 'string',
        filter: false,
      }
    }
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '员工姓名',
      name: 'name',
      placeholder: '输入员工姓名',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '工号',
      name: 'employeeNo',
      placeholder: '输入工号'
    },
    {
      type: 'input',
      label: '电话',
      name: 'mobile',
      placeholder: '输入电话',
    },
    {
      type: 'input',
      label: '微信',
      name: 'webChat',
      placeholder: '输入微信',
    },
    {
      type: 'input',
      label: '身份证',
      name: 'idCard',
      placeholder: '输入身份证',
    },
    {
      type: 'input',
      label: '住址',
      name: 'address',
      placeholder: '输入住址',
    },
    {
      type: 'input',
      label: '职位',
      name: 'title',
      placeholder: '输入职位',
    },
  ];
  source: LocalDataSource = new LocalDataSource();

  userData: any;
  selectOrg: any;
  selectUser: any = [];
  orgList: any;

  constructor(
    private modalService: NgbModal,
    private _state: GlobalState,
    private _orgService: OrgService,
    private userService: UserService) {

    const that = this;
    this._state.subscribe('org.selectedChanged', (org) => {
      this.selectOrg = org.data;
      this.onSearchOrg(org.data.id);
    });
  }

  ngOnInit() {
    if (this.checkable) {
      this.settings.selectMode = 'multi';
      this.settings['actions'] = false;
      this.newSettings = Object.assign({}, this.settings)
    } else {
      this.settings['actions'] = {
        columnTitle: '操作',
        edit: true,
        delete: true
      };
      this.newSettings = Object.assign({}, this.settings);
    }
    this.getUserList();
  }

  getUserList() {
    this.loading = true;
    this.userService.getUsers().then((data) => {
      this.source.reset();
      this.source.load(data);
      this.userData = data;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this.message.emit({ type: 'error', msg: err });
    });

    this._orgService.getAll().then((data) => {
      this.orgList = data;
    });
  }

  ngAfterViewInit() {

  }
  //选择房间
  rowClicked(event): void {
    if (this.checkable) {
      if (event.isSelected) {
        this.selectUser.push({ id: event.data.employeeNo, name: event.data.name });
      } else {
        _.remove(this.selectUser, function (n) {
          return n['id'] == event.data.employeeNo;
        });
      }
    }
  }

  onSearchOrg(orgid: number) {
    this.source.reset();
    this.source.load(_.filter(this.userData, f => { return f['orgId'] == orgid; }));
  }
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'name', search: query },
    ], false);
  }

  onSetOrgClick(org) {
    const that = this;
    if (this.selectUser) {
      _.each(this.selectUser, f => {
        that.userService.updateOrgId(f['id'], org.id);
      });
      this.getUserList();
    } else {
      that.message.emit({ type: 'warning', msg: "请勾选要设置的用户。" });
    }
  }
  onNewUser() {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增员工';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      let user = JSON.parse(result);
      that.userService.create(user).then((data) => {
        closeBack();
        that.message.emit({ type: 'success', msg: "新增成功。" });
        that.getUserList();
      },
        (err) => {
          that.message.emit({ type: 'error', msg: err });
        }
      )
    };
  }

  onEdit(event) {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '修改员工';
    let newConfig = this.config;
    modalRef.componentInstance.config = newConfig;
    modalRef.componentInstance.formValue = event.data;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.userService.update(event.data.id, JSON.parse(result)).then((data) => {
        closeBack();
        that.message.emit({ type: 'success', msg: "修改成功。" });
        that.getUserList();
      },
        (err) => {
          that.message.emit({ type: 'error', msg: err });
        }
      )
    };
  }
  // 删除选择的用户
  onDelete(event) {
    if (window.confirm('你确定要删除吗?')) {
      this.userService.delete(event.data.id).then((data) => {
        this.message.emit({ type: 'success', msg: "删除成功。" });
        this.getUserList();
      }, (err) => {
        this.message.emit({ type: 'error', msg: err });
      });
    }
  }
}
