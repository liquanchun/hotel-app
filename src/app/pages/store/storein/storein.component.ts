import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { StoreinService } from './storein.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-storein',
  templateUrl: './storein.component.html',
  styleUrls: ['./storein.component.scss'],
  providers: [StoreinService],
})
export class StoreinComponent implements OnInit, AfterViewInit {

  title = '入库查询';
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
      storeinTime: {
        title: '单据号',
        type: 'string',
        width: '100px',
        filter: false,
      },
      storeinMan: {
        title: '类型',
        type: 'string',
        filter: false,
        width: '80px',
      },
      houseCode: {
        title: '日期',
        type: 'string',
        filter: false,
        width: '80px',
      },
      address: {
        title: '供应商',
        type: 'string',
        filter: false,
        width: '80px',
      },
      isOverStay: {
        title: '仓库',
        type: 'number',
        filter: false
      },
      createdBy: {
        title: '经办人',
        type: 'string',
        filter: false
      },
      amount: {
        title: '折后金额',
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
    private storeinService: StoreinService,
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
      { field: 'storeinMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.storeinService.getStoreins().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
