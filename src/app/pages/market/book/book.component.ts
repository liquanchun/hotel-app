import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { HouseinfoService } from '../../house/houseinfo/houseinfo.services';
import { HouseTypeService } from '../../sys/house-type/house-type.services';
import { ServiceItemService } from '../serviceitem/serviceitem.services';
import { NgbdModalContent } from '../../../modal-content.component'
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { BookService } from './book.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import { SelectServiceComponent } from './../selectservice/selectservice.component';
import { DynamicFormComponent }
  from '../../../theme/components/dynamic-form/containers/dynamic-form/dynamic-form.component';

import * as $ from 'jquery';
import * as _ from 'lodash';
import { retry } from 'rxjs/operator/retry';
import { fail } from 'assert';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [BookService, HouseinfoService, HouseTypeService,ServiceItemService],
})
export class BookComponent implements OnInit, AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  loading = false;
  title = '预定管理';
  query: string = '';

  settings = {
    mode: 'external',
    actions: {
      columnTitle: '操作'
    },
    hideSubHeader: true,
    edit: {
      editButtonContent: '详情',
      confirmSave: false,
    },
    delete: {
      deleteButtonContent: '取消',
      confirmDelete: true
    },
    columns: {
      orderNo: {
        title: '单号',
        type: 'string',
      },
      status: {
        title: '状态',
        type: 'string',
      },
      cusName: {
        title: '预定人',
        type: 'string',
      },
      mobile: {
        title: '手机号',
        type: 'string',
      },
      bookTime: {
        title: '预定时间',
        type: 'string',
      },
      reachTime: {
        title: '预抵时间',
        type: 'string',
      },
      days: {
        title: '天数',
      },
      leaveTime: {
        title: '预离时间',
        type: 'string',
      },
      retainTime: {
        title: '保留时间',
        type: 'string',
      },
      checkInType: {
        title: '入住方式',
        type: 'string',
      },
      houseTypeName: {
        title: '房型',
        type: 'string',

      },
      houseNum: {
        title: '房间数',
        type: 'number',
      },
      channels: {
        title: '渠道',
        type: 'string',
      },
    }
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '预定人',
      name: 'cusName',
      placeholder: '输入预定人',
      validation: [Validators.required, Validators.minLength(2)],
    },
    {
      type: 'input',
      label: '电话',
      name: 'mobile',
      placeholder: '输入电话',
      validation: [Validators.required, Validators.minLength(3)],
    },
    {
      type: 'input',
      label: '身份证',
      name: 'iDCard',
      placeholder: '输入身份证',
      validation: [Validators.required],
    },
    {
      type: 'datepicker',
      label: '预抵时间',
      name: 'reachTime',
      time: '15:30',
    },
    {
      type: 'input',
      label: '天数',
      name: 'days',
      placeholder: '输入天数',
    },
    {
      type: 'datepicker',
      label: '预离时间',
      name: 'leaveTime',
      time: '15:30',
    },
    {
      type: 'datepicker',
      label: '保留时间',
      name: 'retainTime',
      time: '15:30',
    },
    {
      type: 'check',
      label: '入住方式',
      name: 'checkInType',
      check: 'radio',
      options: [
        { id: '全天房', name: '全天房' },
        { id: '钟点房', name: '钟点房' },
        { id: '特殊房', name: '特殊房' },
      ]
    },
    {
      type: 'check',
      label: '房型',
      name: 'houseTypeId',
      check: 'radio',
      options: []
    },
    {
      type: 'input',
      label: '房间数',
      name: 'houseNum',
      placeholder: '输入房间数',
    },
    {
      label: '保存',
      name: 'submit',
      type: 'button',
      callback: function () {
      },
    },
  ];

  gridClasses = {
    'showEdit': true,
    'hideEdit': false
  };
  editClasses = {
    'showEdit': false,
    'hideEdit': true
  };
  source: LocalDataSource = new LocalDataSource();
  //服务项目
  serviceItemData = [];

  constructor(
    private modalService: NgbModal,
    private bookService: BookService,
    private houseinfoService: HouseinfoService,
    private _houseTypeService: HouseTypeService,
    private _serviceItemService:ServiceItemService,
    private _common: Common,
    private _state: GlobalState) {
    this._state.subscribe('backup-click', (data) => {
      this.onCreate(false);
    });
  }
  ngOnInit() {
    this.getDataList();
    this.getHouseType();
  }
  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });

    this.form.setDisabled('submit', true);
  }
  submit(book: { [name: string]: any }) {
    if (book.reachTime) {
      book.reachTime = this._common.getDateString2(book.reachTime);
    }
    if (book.leaveTime) {
      book.leaveTime = this._common.getDateString2(book.leaveTime);
    }
    if (book.retainTime) {
      book.retainTime = this._common.getDateString2(book.retainTime);
    }
    this.bookService.create(book).then((data) => {
      const msg = "新增成功。";
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
      this.getDataList();
    },
      (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      }
    )
  }
  onCreate(isEdit = true) {
    this.gridClasses = {
      'showEdit': !isEdit,
      'hideEdit': isEdit
    };
    this.editClasses = {
      'showEdit': isEdit,
      'hideEdit': !isEdit
    };
  }
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'cusName', search: query },
      { field: 'mobile', search: query },
      { field: 'channels', search: query },
    ], false);
  }
  getHouseType(): void {
    this._houseTypeService.getHouseTypes().then((data) => {
      let opt = [];
      _.each(data, d => {
        opt.push({ id: d['id'], name: d['typeName'] });
      });
      let conf = _.find(this.config, f => { return f.name == 'houseTypeId'; });
      conf.options = opt;
    });
  }
  getDataList(): void {
    this.loading = true;
    this.bookService.getBooks().then((data) => {
      this.loading = false;
      this.source.load(data);
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });

    });
  }

  onDelete(event) {
    if (window.confirm('你确定要取消吗?')) {
      this.bookService.delete(event.data.id).then((data) => {
        this._state.notifyDataChanged("showMessage.open", { message: "删除成功", type: "error", time: new Date().getTime() });
        this.getDataList();
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      });
    }
  }

  onChange(event) {
    if (event && event.length > 0) {
      //this.source.load(_.filter(this.storeInData, f => { return f['supplierId'] == event[0] }));
    } else {
      //this.source.load(this.storeInData);
    }
  }

  onEdit(event) {

  }
}
