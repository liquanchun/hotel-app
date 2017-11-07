import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { BookService } from './book.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [BookService],
})
export class BookComponent implements OnInit, AfterViewInit {

  title = '预定管理';
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
      bookMan: {
        title: '预定方式',
        type: 'string',
        filter: false,
        width: '80px',
      },
      bookTime: {
        title: '预定人',
        type: 'string',
        width: '100px',
        filter: false,
      },
      houseCode: {
        title: '手机号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      address: {
        title: '预定时间',
        type: 'string',
        filter: false,
        width: '80px',
      },
      isOverStay: {
        title: '预抵时间',
        type: 'number',
        filter: false
      },
      tianshu: {
        title: '天数',
        type: 'number',
        filter: false
      },
      fjs: {
        title: '房间数',
        type: 'number',
        filter: false
      },
      ydj: {
        title: '预定金',
        type: 'number',
        filter: false
      },
      yddh: {
        title: '预定单号',
        type: 'number',
        filter: false
      },
      picihao: {
        title: '批次号',
        type: 'number',
        filter: false
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
    private bookService: BookService,
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
      { field: 'bookMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.bookService.getBooks().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
