import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { CusgoodsService } from './cusgoods.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-cusgoods',
  templateUrl: './cusgoods.component.html',
  styleUrls: ['./cusgoods.component.scss'],
  providers: [CusgoodsService],
})
export class CusgoodsComponent implements OnInit, AfterViewInit {

  title = '客人物品管理';
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
        title: '存放时间',
        type: 'string',
        width: '100px',
        filter: false,
      },
      typeName: {
        title: '物品类型',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsName: {
        title: '名称',
        type: 'string',
        filter: false,
        width: '80px',
      },
      goodsPrice: {
        title: '物品价值',
        type: 'string',
        filter: false,
        width: '80px',
      },
      cusName: {
        title: '客人姓名',
        type: 'string',
        filter: false
      },
      mobile: {
        title: '联系电话',
        type: 'string',
        filter: false
      },
      houseCode: {
        title: '房间号',
        type: 'string',
        filter: false
      },
      createdBy: {
        title: '存放操作员',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      },
      updateAt: {
        title: '领取时间',
        type: 'string',
        filter: false
      },
      updateBy: {
        title: '领取操作员',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private cusgoodsService: CusgoodsService,
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
      { field: 'cusgoodsMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.cusgoodsService.getCusgoodss().then((data) => {
      this.source.load(data);
    });
  }
}
