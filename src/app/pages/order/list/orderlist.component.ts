import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { ButtonViewComponent } from './buttonview.component';
import { OrderlistService } from './orderlist.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
  providers: [OrderlistService],
})
export class OrderlistComponent implements OnInit, AfterViewInit {

  greeting = {};
  name = 'World';

  @ViewChild('p') public popover: NgbPopover;

  title = '订单查询';
  totalRecord = 89;
  page = 1;
  query: string = '';

  settings = {
    mode: 'external',
    actions: {
      columnTitle: '查看',
      delete:false,
    },
    hideSubHeader: true,
    edit: {
      editButtonContent: '<span>详情</span>',
      confirmSave: false,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },
      orderNo: {
        title: '订单号',
        type: 'string',
        filter: false,
      },
      createdAt: {
        title: '订单日期',
        type: 'string',
        filter: false,
      },
      cusName: {
        title: '客人姓名',
        type: 'string',
        filter: false,
      },
      cusPhone: {
        title: '电话',
        type: 'string',
        filter: false,
      },
      idCard: {
        title: '身份证',
        type: 'string',
        filter: false,
      },
      inType: {
        title: '入住方式',
        type: 'string',
        filter: false
      },
      houseFee: {
        title: '合计房费',
        type: 'number',
        filter: false
      },
      preReceivefee: {
        title: '预收押金',
        type: 'number',
        filter: false
      },
      status: {
        title: '结账状态',
        type: 'string',
        filter: false
      },
      button: {
        title: '...',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        },
        editable: false
      }
    }
  };

  settingsHouse = {
    actions: false,
    hideSubHeader: true,
    noDataMessage: '',
    columns: {
      cusName: {
        title: '客人姓名',
        type: 'string',
        filter: false
      },
      idCard: {
        title: '客人身份证',
        type: 'string',
        filter: false
      },
      houseCode: {
        title: '房号',
        type: 'number',
        filter: false,
        editable: false
      },
      houseTypeTxt: {
        title: '房型',
        type: 'string',
        filter: false,
        editable: false
      },
      houseFee: {
        title: '房费',
        type: 'number',
        filter: false,
        editable: false
      },
      days: {
        title: '入住天数',
        type: 'number',
        filter: false
      },
      coupons: {
        title: '早餐券',
        type: 'number',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  selectedGrid: LocalDataSource = new LocalDataSource();

  orderDetail:any = [];

  constructor(
    private orderlistService: OrderlistService,
    private modalService: NgbModal,
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
      { field: 'cusName', search: query },
      { field: 'cusPhone', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }
  onEdit(event):void{
  }
  getDataList(): void {
    this.orderlistService.getOrderlists().then((data) => {
      this.source.load(data['orderList']);
      this.orderDetail = data['orderDetailList'];
      this.totalRecord = data['orderList'].length;
    });
  }
  open(event,content) {
    const orderId = event.data.id;
    const orderDetail = _.filter(this.orderDetail,(f)=>{ return f['orderId'] = orderId ;});
    this.selectedGrid.load(orderDetail);

    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
    _.delay(function (text) {
      $(".modal-dialog").css("max-width", "745px");
    }, 100, 'later');
  }
}
