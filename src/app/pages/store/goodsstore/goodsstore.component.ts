import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { GoodsstoreService } from './goodsstore.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-goodsstore',
  templateUrl: './goodsstore.component.html',
  styleUrls: ['./goodsstore.component.scss'],
  providers: [GoodsstoreService],
})
export class GoodsstoreComponent implements OnInit, AfterViewInit {

  title = '货品库存';
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
      goodsstoreTime: {
        title: '货品名称',
        type: 'string',
        width: '100px',
        filter: false,
      },
      goodsstoreMan: {
        title: '类别',
        type: 'string',
        filter: false,
        width: '80px',
      },
      houseCode: {
        title: '单位',
        type: 'string',
        filter: false,
        width: '80px',
      },
      address: {
        title: '仓库',
        type: 'string',
        filter: false,
        width: '80px',
      },
      isOverStay: {
        title: '库存',
        type: 'number',
        filter: false
      },
      price: {
        title: '售价',
        type: 'number',
        filter: false
      },
      amount: {
        title: '金额',
        type: 'number',
        filter: false
      },
      createdBy: {
        title: '备注',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private goodsstoreService: GoodsstoreService,
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
      { field: 'goodsstoreMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.goodsstoreService.getGoodsstores().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
