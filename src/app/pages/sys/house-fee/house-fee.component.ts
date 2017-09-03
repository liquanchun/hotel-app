import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { HouseFeeService } from './house-fee.services';
import { GlobalState } from '../../../global.state';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-house-fee',
  templateUrl: './house-fee.component.html',
  styleUrls: ['./house-fee.component.scss'],
  providers: [HouseFeeService],
})
export class HouseFeeComponent implements OnInit, AfterViewInit {

  query: string = '';

  settingsAll = {
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
        title: '房型',
        type: 'string',
        filter: false
      },
      halfPriceHours: {
        title: '首日计半价时长',
        type: 'number',
        filter: false
      },
      allPriceHours: {
        title: '首日计全价时长',
        type: 'number',
        filter: false
      },
      leaveTime: {
        title: '退房时间',
        type: 'string',
        filter: false
      },
      addFeeHours: {
        title: '加收缓冲时长',
        type: 'number',
        filter: false
      },
      addFeeType: {
        title: '加收方式',
        type: 'string',
        filter: false
      },
      addAllDay: {
        title: '固定加收全日租',
        type: 'number',
        filter: false
      },
      addAllHours: {
        title: '加租全日租时长',
        type: 'number',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };


  settingsHours = {
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
        filter: false
      },
      hours: {
        title: '时长',
        type: 'number',
        filter: false
      },
      halfPriceHours: {
        title: '计半价时长',
        type: 'number',
        filter: false
      },
      checkInTime1: {
        title: '入住时间起',
        type: 'string',
        filter: false
      },
      checkInTime2: {
        title: '入住时间止',
        type: 'string',
        filter: false
      },
      addBuffTime: {
        title: '加收缓冲时间',
        type: 'number',
        filter: false
      },
      turnNormal: {
        title: '超过多少分钟转正常',
        type: 'number',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };


  settingsOther = {
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
        filter: false
      },
      halfPriceHours: {
        title: '计半价时长',
        type: 'number',
        filter: false
      },
      allPriceHours: {
        title: '计全价时长',
        type: 'number',
        filter: false
      },
      checkInTime1: {
        title: '入住时间起',
        type: 'string',
        filter: false
      },
      checkInTime2: {
        title: '入住时间止',
        type: 'string',
        filter: false
      },
      leaveTime: {
        title: '退房时间',
        type: 'string',
        filter: false
      },
      addBuffTime: {
        title: '加收缓冲时间',
        type: 'number',
        filter: false
      },
      addFeeType: {
        title: '加收方式',
        type: 'number',
        filter: false
      },
      turnNormal: {
        title: '超过多少分钟转正常',
        type: 'number',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };

  sourceAll: LocalDataSource = new LocalDataSource();
  sourceHours: LocalDataSource = new LocalDataSource();
  sourceOther: LocalDataSource = new LocalDataSource();

  constructor(
    private houseFeeService: HouseFeeService,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  getDataList(): void {
    this.houseFeeService.getHouseFees('SetAllhousePrice').then((data) => {
      this.sourceAll.load(data);
    });
    this.houseFeeService.getHouseFees('SetHourhousePrice').then((data) => {
      this.sourceHours.load(data);
    });
    this.houseFeeService.getHouseFees('SetOtherhousePrice').then((data) => {
      this.sourceOther.load(data);
    });
  }
  // 新增
  onCreateConfirm(modelName, event): void {
    if (event.newData) {
      this.houseFeeService.create(modelName, event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 修改
  onSaveConfirm(modelName, event): void {
    if (event.newData && event.newData.id) {
      this.houseFeeService.update(modelName, event.newData.id, event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 删除
  onDeleteConfirm(modelName, event): void {
    if (window.confirm('你确定要删除吗?')) {
      this.houseFeeService.delete(modelName, event.data.id).then((data) => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

}
