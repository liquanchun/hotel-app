import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { CusaccountService } from './cusaccount.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-cusaccount',
  templateUrl: './cusaccount.component.html',
  styleUrls: ['./cusaccount.component.scss'],
  providers: [CusaccountService],
})
export class CusaccountComponent implements OnInit, AfterViewInit {

  title = '客账查询';
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
      houseCode: {
        title: '房间号',
        type: 'string',
        filter: false
      },
      customer: {
        title: '客户姓名',
        type: 'string',
        filter: false
      },
      createdAt: {
        title: '消费时间',
        type: 'string',
        width: '100px',
        filter: false,
      },
      typeName: {
        title: '项目',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsName: {
        title: '数量',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsPrice: {
        title: '金额',
        type: 'string',
        filter: false,
        width: '80px',
      },
      cusName: {
        title: '班次',
        type: 'string',
        filter: false
      },
      
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private cusaccountService: CusaccountService,
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
      { field: 'cusaccountMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.cusaccountService.getCusaccounts().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
