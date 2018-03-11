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
import { DicService } from '../../sys/dic/dic.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import { SelectServiceComponent } from './../selectservice/selectservice.component';
import { CheckInComponent } from './checkin.component';
import { Router } from '@angular/router';
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
  providers: [BookService, HouseinfoService, HouseTypeService, ServiceItemService],
})
export class BookComponent implements OnInit, AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(SelectServiceComponent)
  private serviceComponent: SelectServiceComponent;

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
      checkInTypeTxt: {
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
      button: {
        title: '入住',
        type: 'custom',
        renderComponent: CheckInComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
          });
        },
      }
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
      name: 'idCard',
      placeholder: '输入身份证',
      validation: [Validators.required],
    },
    {
      type: 'datepicker',
      label: '预抵时间',
      name: 'reachTime',
      time: '15:30',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '天数',
      name: 'days',
      placeholder: '输入天数',
      validation: [Validators.required],
    },
    {
      type: 'datepicker',
      label: '预离时间',
      name: 'leaveTime',
      time: '15:30',
      validation: [Validators.required],
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
      options: []
    },
    {
      type: 'select',
      label: '房型',
      name: 'houseTypeId',
      options: []
    },
    {
      type: 'input',
      label: '房间数',
      name: 'houseNum',
      placeholder: '输入房间数',
      validation: [Validators.required],
    },
    {
      label: '保存',
      name: 'submit',
      type: 'button',
      callback: function (data) {
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
  bookData: any;
  //服务项目
  serviceItemData = [];
  //表单值
  formValue: any;

  constructor(private _router: Router,
    private modalService: NgbModal,
    private bookService: BookService,
    private houseinfoService: HouseinfoService,
    private _houseTypeService: HouseTypeService,
    private _serviceItemService: ServiceItemService,
    private _dicService: DicService,
    private _common: Common,
    private _state: GlobalState) {
    this._state.subscribe('backup-click', (data) => {
      this.showEditDiv(false);
    });

    this._state.subscribe('checkin.click', (data) => {
      const book = _.find(this.bookData, f => { return f['id'] == data.id; });
      _.delay(function (that) {
        that._router.navigate(['/pages/frontdesk/checkin'], { queryParams: { id: data.id,orderNo: book['orderNo'] } });
      }, 300, this);
    });

  }
  ngOnInit() {

    this._dicService.getDicByName('入住方式', (data) => {
      let cfg = _.find(this.config, f => { return f['name'] == 'checkInType'; });
      if (cfg) {
        let opt = [];
        _.each(data, d => {
          opt.push({ id: d['id'], name: d['name'] });
        });
        cfg.options = opt;
      }
    });

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
    if (!book.checkInType) {
      this._state.notifyDataChanged("showMessage.open", { message: "请选择入住方式", type: "warning", time: new Date().getTime() });
      return;
    }
    if (!book.houseTypeId) {
      this._state.notifyDataChanged("showMessage.open", { message: "请选择房型", type: "warning", time: new Date().getTime() });
      return;
    }
    console.log(book);
    const bookingObj = {
      booking: book,
      bookservices: this.serviceComponent.selectedItem
    }

    if (bookingObj.booking.reachTime) {
      bookingObj.booking.reachTime = this._common.getDateString2(book.reachTime);
    }
    if (bookingObj.booking.leaveTime) {
      bookingObj.booking.leaveTime = this._common.getDateString2(book.leaveTime);
    }
    if (bookingObj.booking.retainTime) {
      bookingObj.booking.retainTime = this._common.getDateString2(book.retainTime);
    }

    this.bookService.create(bookingObj).then((data) => {
      const msg = "新增成功。";
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
      this.getDataList();
      this.showEditDiv(false);
    },
      (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      }
    )
  }
  showEditDiv(isEdit = true) {
    this.gridClasses = {
      'showEdit': !isEdit,
      'hideEdit': isEdit
    };
    this.editClasses = {
      'showEdit': isEdit,
      'hideEdit': !isEdit
    };
  }

  onCreate() {
    this.form.clearValue();
    this.serviceComponent.clearData();
    this.serviceComponent.setDisableEdit(true);
    this.showEditDiv();
    this.form.hideSubmit(false);
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
  getDataList(type = 2): void {

    this.loading = true;
    this.bookService.getBooks(type).then((data) => {
      this.loading = false;
      this.bookData = data;
      this.source.load(data);
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });

    });
  }

  onDelete(event) {
    if (window.confirm('你确定要取消吗?')) {
      this.bookService.delete(event.data.id).then((data) => {
        this._state.notifyDataChanged("showMessage.open", { message: "取消成功", type: "success", time: new Date().getTime() });
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
    const data = _.find(this.bookData, f => { return f['id'] == event.data.id; });
    this.formValue = data;
    if (_.isString(data['retainTime'])) {
      this.formValue.retainTime = this._common.getDateObject(data['retainTime']);
      this.formValue.leaveTime = this._common.getDateObject(data['leaveTime']);
      this.formValue.reachTime = this._common.getDateObject(data['reachTime']);
    }
    const that = this;
    _.delay(function (that) {
      const sf = that;
      _.each(that.config, (e) => {
        if (sf.formValue && sf.formValue[e.name]) {
          if (_.isArray(sf.formValue[e.name]) || _.isObject(sf.formValue[e.name])) {
            sf.form.setValue(e.name, sf.formValue[e.name]);
          } else {
            sf.form.setValue(e.name, sf.formValue[e.name].toString());
          }
        }
      });
    }, 100, this);
    this.showEditDiv();
    this.form.hideSubmit(true);
    this.serviceComponent.setDisableEdit(false);
    this.serviceComponent.loadData(data['orderNo']);
  }
}
