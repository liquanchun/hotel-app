import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { StatelogService } from './statelog.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-statelog',
  templateUrl: './statelog.component.html',
  styleUrls: ['./statelog.component.scss'],
  providers: [StatelogService],
})
export class StatelogComponent implements OnInit {

  title = '房态日志';
  query: string = '';
  loading = false;
  settings = {
    mode: 'external',
    actions: false,
    hideSubHeader: true,
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
      },
      createdAt: {
        title: '变更时间',
        type: 'string',
        filter: false,
      },
      houseCode: {
        title: '房号',
        type: 'string',
        filter: false,
      },
      oldStateTxt: {
        title: '原状态',
        type: 'string',
        filter: false,
      },
      newStateTxt: {
        title: '新状态',
        type: 'string',
        filter: false,
      },
      orderNo: {
        title: '订单号',
        type: 'string',
        filter: false,
      },
      createdBy: {
        title: '操作员',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private statelogService: StatelogService,
    private _common: Common,
    private _state: GlobalState) {
  }
  ngOnInit() {
    this.getDataList();
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'oldState', search: query },
      { field: 'houseCode', search: query },
      { field: 'newState', search: query },
    ], false);
  }

  getDataList(): void {
    this.loading = true;
    this.statelogService.getStatelogs().then((data) => {
      this.loading = false;
      this.source.load(data);
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      
    });
  }
}
