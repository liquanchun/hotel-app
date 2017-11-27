import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { CustomerService } from './customer.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [CustomerService],
})
export class CustomerComponent implements OnInit, AfterViewInit {

  title = '顾客档案';
  query: string = '';

  settings = {
    mode: 'external',
    actions: {
      columnTitle: '操作'
    },
    hideSubHeader: true,
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },

      customerMan: {
        title: '姓名',
        type: 'string',
        filter: false,
        width: '80px',
      },
      customerType: {
        title: '客户类型',
        type: 'string',
        filter: false,
        width: '80px',
      },
      houseCode: {
        title: '手机号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      address: {
        title: '微信号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      idcard: {
        title: '证件号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      customerTime: {
        title: '是否会员',
        type: 'string',
        width: '100px',
        filter: false,
      },
      cardtype: {
        title: '会员类型',
        type: 'string',
        width: '100px',
        filter: false,
      },
      isOverStay: {
        title: '累计来店次数',
        type: 'number',
        filter: false
      },
      ljxfje: {
        title: '累计消费金额',
        type: 'number',
        filter: false
      },
      ljjf: {
        title: '最近来店日期',
        type: 'number',
        filter: false
      },
      syjf: {
        title: '查看历史消费记录',
        type: 'number',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'number',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private customerService: CustomerService,
    private _common: Common,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
  onPageChange(p) {
    console.log("page:" + p);
  }
  onCreate() {

  }
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'customerMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.customerService.getCustomers().then((data) => {
      this.source.load(data);
    });
  }
}
