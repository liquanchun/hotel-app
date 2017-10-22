import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { HouseinfoService } from './houseinfo.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-houseinfo',
  templateUrl: './houseinfo.component.html',
  styleUrls: ['./houseinfo.component.scss'],
  providers: [HouseinfoService],
})
export class HouseinfoComponent implements OnInit, AfterViewInit {

  title = '房间管理';
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
      code: {
        title: '房号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      floor: {
        title: '楼层',
        type: 'string',
        filter: false,
        width: '80px',
      },
      houseType: {
        title: '房型',
        type: 'string',
        filter: false,
        width: '80px',
      },
      tags: {
        title: '房屋信息',
        type: 'string',
        filter: false,
        width: '80px',
      },
      state: {
        title: '房屋状态',
        type: 'string',
        filter: false,
        width: '80px',
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
    private houseinfoService: HouseinfoService,
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
      { field: 'code', search: query },
      { field: 'tags', search: query },
      { field: 'state', search: query },
    ], false);
  }

  getDataList(): void {
    this.houseinfoService.getHouseinfos().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
