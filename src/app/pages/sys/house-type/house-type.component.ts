import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { HouseTypeService } from './house-type.services';
import { GlobalState } from '../../../global.state';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-house-type',
  templateUrl: './house-type.component.html',
  styleUrls: ['./house-type.component.scss'],
  providers: [HouseTypeService],
})
export class HouseTypeComponent implements OnInit, AfterViewInit {

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
        filter: false
      },
      typeName: {
        title: '房型',
        type: 'string',
        filter: false
      },
      allPrice: {
        title: '全价',
        type: 'number',
        filter: false
      },
      startPrice: {
        title: '起步价',
        type: 'number',
        filter: false
      },
      addPrice: {
        title: '单位时间内加价',
        type: 'number',
        filter: false
      },
      addMaxPrice: {
        title: '加价封顶额',
        type: 'number',
        filter: false
      },
      preReceiveFee: {
        title: '预收房费',
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

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private houseTypeService: HouseTypeService,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  getDataList(): void {
    this.houseTypeService.getHouseTypes().then((data) => {
      this.source.load(data);
    });
  }
  // 新增
  onCreateConfirm(event): void {
    if (event.newData) {
      this.houseTypeService.create(event.newData).then((data) => {
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
      this.houseTypeService.update(event.newData.id, event.newData).then((data) => {
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
      this.houseTypeService.delete(event.data.id).then((data) => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

}
