import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { DicService } from '../../sys/dic/dic.services';
import { GoodsstoreService } from './goodsstore.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-goodsstore',
  templateUrl: './goodsstore.component.html',
  styleUrls: ['./goodsstore.component.scss'],
  providers: [GoodsstoreService, DicService],
})
export class GoodsstoreComponent implements OnInit {

  loading = false;
  title = '商品库存';
  query: string = '';

  settings = {
    pager: {
      perPage: 15
    },
    actions: false,
    mode: 'external',
    hideSubHeader: true,
    columns: {
      storeIdTxt: {
        title: '仓库',
        type: 'string',
        filter: false,
      },
      goodsTypeIdTxt: {
        title: '商品类别',
        type: 'string',
        filter: false,
      },
      goodsIdTxt: {
        title: '商品',
        type: 'string',
      },
      number: {
        title: '库存量',
        type: 'number',
        filter: false,
      },
      goodsSite: {
        title: '货位',
        type: 'string',
        filter: false,
      },
      amount: {
        title: '库存金额',
        type: 'number',
        filter: false
      },
      createdBy: {
        title: '备注',
        type: 'string',
        filter: false
      },
      updatedAt: {
        title: '更新时间',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  //仓库
  stores: any = [];
  goodsType: any = [];
  storeData:any;

  constructor(
    private goodsstoreService: GoodsstoreService,
    private _dicService: DicService,
    private _common: Common,
    private _state: GlobalState) {
  }
  ngOnInit() {
    this.getDataList();
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'goodsIdTxt', search: query },
      { field: 'goodsTypeIdTxt', search: query },
      { field: 'storeIdTxt', search: query },
    ], false);
  }

  onStoresChange(store){
    if(store.target.value ){
      this.source.load(_.filter(this.storeData,f =>{ return f['storeId'] == store.target.value }));
    }else{
      this.source.load(this.storeData);
    }
  }

  onGoodsTypeChange(type){
    if(type.target.value ){
      this.source.load(_.filter(this.storeData,f =>{ return f['goodsTypeId'] == type.target.value }));
    }else{
      this.source.load(this.storeData);
    }
  }

  getDataList(): void {
    this._dicService.getDicByName('仓库', (data) => { this.stores = data; });
    this._dicService.getDicByName('商品类别', (data) => { this.goodsType = data; });
    this.loading = true;
    this.goodsstoreService.getGoodsstores().then((data) => {
      this.storeData = data;
      this.source.load(data);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      
    });
  }
}
