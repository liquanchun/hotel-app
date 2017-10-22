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
export class StatelogComponent implements OnInit, AfterViewInit {

  title = '房态日志';
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
        title: '变更时间',
        type: 'string',
        width: '100px',
        filter: false,
      },
      houseCode: {
        title: '房号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      oldState: {
        title: '原状态',
        type: 'string',
        filter: false,
        width: '80px',
      },
      newState: {
        title: '新状态',
        type: 'string',
        filter: false,
        width: '80px',
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
      { field: 'oldState', search: query },
      { field: 'houseCode', search: query },
      { field: 'newState', search: query },
    ], false);
  }

  getDataList(): void {
    this.statelogService.getStatelogs().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
