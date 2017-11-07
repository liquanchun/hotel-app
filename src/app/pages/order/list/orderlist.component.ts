import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { OrderlistService } from './orderlist.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
  providers: [OrderlistService],
})
export class OrderlistComponent implements OnInit, AfterViewInit {

  title = '订单查询';
  totalRecord = 89;
  page = 1;
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
      orderlistTime: {
        title: '订单号',
        type: 'string',
        width: '100px',
        filter: false,
      },
      orderlistMan: {
        title: '订单日期',
        type: 'string',
        filter: false,
        width: '80px',
      },
      houseCode: {
        title: '客户姓名',
        type: 'string',
        filter: false,
        width: '80px',
      },
      address: {
        title: '房号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      isOverStay: {
        title: '入住时间',
        type: 'number',
        filter: false
      },
      createdBy: {
        title: '离开时间',
        type: 'string',
        filter: false
      },
      state: {
        title: '结账状态',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private orderlistService: OrderlistService,
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
      { field: 'orderlistMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.orderlistService.getOrderlists().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
