import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { PreauthService } from './preauth.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-preauth',
  templateUrl: './preauth.component.html',
  styleUrls: ['./preauth.component.scss'],
  providers: [PreauthService],
})
export class PreauthComponent implements OnInit, AfterViewInit {

  title = '预授权查询';
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
      cusName: {
        title: '客人姓名',
        type: 'string',
        filter: false
      },
      houseCode: {
        title: '房间号',
        type: 'string',
        filter: false
      },
      typeName: {
        title: '金额',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsName: {
        title: '预授权号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsPrice: {
        title: '有效日期',
        type: 'string',
        filter: false,
        width: '80px',
      },
      billno: {
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
    private preauthService: PreauthService,
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
      { field: 'preauthMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.preauthService.getPreauths().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
