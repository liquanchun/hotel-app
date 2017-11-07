import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { PremoneyService } from './premoney.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-premoney',
  templateUrl: './premoney.component.html',
  styleUrls: ['./premoney.component.scss'],
  providers: [PremoneyService],
})
export class PremoneyComponent implements OnInit, AfterViewInit {

  title = '预定金查询';
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
      createdAt: {
        title: '消费时间',
        type: 'string',
        width: '100px',
        filter: false,
      },
      typeName: {
        title: '预定人',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsName: {
        title: '支付类型',
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
        title: '批次号',
        type: 'string',
        filter: false
      },
      mobile: {
        title: '单据号',
        type: 'string',
        filter: false
      },
      createdBy: {
        title: '操作员',
        type: 'string',
        filter: false
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
    private premoneyService: PremoneyService,
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
      { field: 'premoneyMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.premoneyService.getPremoneys().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
