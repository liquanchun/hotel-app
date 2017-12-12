import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import * as $ from 'jquery';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { HouseinfoService } from '../../house/houseinfo/houseinfo.services';
import { CheckinService } from './../checkin/checkin.services';
import { HouseTypeService } from '../../sys/house-type/house-type.services';
import { SetPaytypeService } from '../../sys/set-paytype/set-paytype.services';
import { DicService } from '../../sys/dic/dic.services';
import { CheckoutService } from './checkout.services';

import { GlobalState } from '../../../global.state';
import { retry } from 'rxjs/operator/retry';
import { ReturnStatement } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-qt-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [CheckoutService, CheckinService, SetPaytypeService, DicService],
})
export class CheckoutComponent implements OnInit {
  @Input() showEditButton: boolean = true;
  title = '退房结账';
  private isSaved: boolean = false;

  private checkIn: any = {
    houseCode: '',
    cusname: '',
    cusphone: '',
    idCard: '',
    inType: '',
    comeType: '',
    payType: '',
    billNo: '',
    remark: '',
    houseFee: 0,
    prereceivefee: 0
  };
  private paytype: any = [];
  private comeType: any = [];
  settingsHouse = {
    actions: {
      columnTitle: '操作',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    noDataMessage: '',
    columns: {
      houseType: {
        title: '房型',
        type: 'string',
        filter: false,
        editable: false
      },
      houseCode: {
        title: '房号',
        type: 'number',
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
      cusname: {
        title: '客人姓名',
        type: 'string',
        filter: false
      },
      idcard: {
        title: '客人身份证',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };

  houseType = [];
  houseInfoSelect = [];
  //选择房间表格
  selectedGrid: LocalDataSource = new LocalDataSource();
  //选择的房间
  selectedHouse: any = [];

  //链接过来的房间号
  private checkInCode: string;

  private toastOptions: ToastOptions = {
    title: "提示信息",
    msg: "The message",
    showClose: true,
    timeout: 2000,
    theme: "bootstrap",
  };

  constructor(
    private _state: GlobalState,
    private _checkoutService: CheckoutService,
    private _checkinService: CheckinService,
    private _setPaytypeService: SetPaytypeService,
    private _dicService: DicService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute) {

    this.toastyConfig.position = 'top-center';
  }
  ngOnInit() {
    this.getDataList();
    this.checkInCode = this.route.snapshot.params['code'];
  }

  onSearch(code: string): void {
    this._checkoutService.getCheckouts(code).then((data) => {
      if (!data) {
        this.toastOptions.msg = '房间不存在。';
        this.toastyService.error(this.toastOptions);
      } else {
        this.checkIn = data;
      }
    },
      (err) => {
        this.toastOptions.msg = err;
        this.toastyService.error(this.toastOptions);
      });
  }

  getDataList(): void {
    this._setPaytypeService.getSetPaytypes().then((data) => {
      const that = this;
      _.each(data, function (d) {
        that.paytype.push({ id: d.id, name: d.name });
      });
    });

    this._dicService.getDicByName('客源', (data) => { this.comeType = data; });
  }
  //刷新表格数据
  refreshTable() {
    this.checkIn.prereceivefee = _.sumBy(this.selectedHouse, function (o) { return o['prereceivefee']; });
    this.checkIn.houseFee = _.sumBy(this.selectedHouse, function (o) { return o['houseFee']; });
    this.selectedGrid.load(this.selectedHouse);
  }

  onSaveConfirm(event): void {
    event.confirm.resolve();
  }

  //确认入住
  onConfirm(): void {
    if (this.selectedHouse.length == 0) {
      this.toastOptions.msg = "请选择房间。";
      this.toastyService.warning(this.toastOptions);
      return;
    }
    this.isSaved = true;
    const that = this;
    this._checkinService.create(
      {
        YxOrder: this.checkIn,
        YxOrderList: this.selectedHouse
      }
    ).then(
      function (v) {
        this.toastOptions.msg = "保存成功。";
        this.toastyService.success(this.toastOptions);
        that.isSaved = false;
        that.checkIn.cusname = '';
        that.checkIn.cusphone = '';
        that.checkIn.idCard = '';
        that.checkIn.inType = '';
        that.checkIn.remark = '';
        that.checkIn.houseFee = '';
        that.checkIn.prereceivefee = '';
        that.checkIn.payType = '';
        that.checkIn.billNo = '';
        that.selectedHouse = [];
        that.selectedGrid.load(that.selectedHouse);
      },
      (err) => {
        this.toastOptions.title = "保存失败";
        this.toastOptions.msg = err;
        this.toastyService.error(this.toastOptions);
        that.isSaved = false;
      }
      )
  }
}

