import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { SetGroupService } from './set-group.services';
import { GlobalState } from '../../../global.state';
import { DateTimeComponent } from '../../components/dateTimeRender/dateTimeRender.component';
import { DatepickerViewComponent } from '../../components/datepickerView/datepickerView.component';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-set-group',
  templateUrl: './set-group.component.html',
  styleUrls: ['./set-group.component.scss'],
  providers: [SetGroupService],
})
export class SetGroupComponent implements OnInit, AfterViewInit {

  query: string = '';

  settings = {
    actions: {
      columnTitle: '操作'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },
      name: {
        title: '名称',
        type: 'string',
        width: '100px',
        filter: false,
      },
      linkMan: {
        title: '联系人',
        type: 'string',
        filter: false,
        width: '80px',
      },
      mobile: {
        title: '电话',
        type: 'number',
        filter: false,
        width: '80px',
      },
      address: {
        title: '地址',
        type: 'string',
        filter: false
      },
      contractNo: {
        title: '合同号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      contractDate1: {
        title: '合同开始日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      contractDate2: {
        title: '合同截止日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      coupons: {
        title: '早餐券',
        type: 'number',
        filter: false
      },
      accountFee: {
        title: '挂账金额',
        type: 'number',
        filter: false,
        editable: false,
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private setGroupService: SetGroupService,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'name', search: query },
      { field: 'linkMan', search: query },
      { field: 'mobile', search: query },
    ], false);
  }
  getDataList(): void {
    this.setGroupService.getSetGroups().then((data) => {
      this.source.load(data);
    });
  }
  // 新增
  onCreateConfirm(event): void {
    if (event.newData) {
      this.setGroupService.create(event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 修改
  onSaveConfirm(event): void {
    if (event.newData && event.newData.id) {
      this.setGroupService.update(event.newData.id, event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 删除
  onDeleteConfirm(event): void {
    if (window.confirm('你确定要删除吗?')) {
      this.setGroupService.delete(event.data.id).then((data) => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

}
