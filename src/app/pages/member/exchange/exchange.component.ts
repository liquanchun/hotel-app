import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbdModalContent } from '../../../modal-content.component'
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { ExchangeService } from './exchange.services';
import { ServiceItemService } from '../../market/serviceitem/serviceitem.services';
import { HouseTypeService } from '../../market/house-type//house-type.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  providers: [ExchangeService, HouseTypeService,ServiceItemService],
})
export class ExchangeComponent implements OnInit, AfterViewInit {
  loading = false;
  query: string = '';

  houseExchange = {
    mode: 'external',
    actions: {
      columnTitle: '操作',
      edit:false
    },
    hideSubHeader: true,
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },
      name: {
        title: '名称',
        type: 'string',
        filter: false
      },
      houseTypeTxt: {
        title: '房型',
        type: 'string',
        filter: false
      },
      integral: {
        title: '所需积分',
        type: 'number',
        filter: false
      },
      startDate: {
        title: '活动开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '活动结束日期',
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

  recordExchange = {
    mode: 'external',
    actions: {
      columnTitle: '操作',
      edit:false
    },
    hideSubHeader: true,
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },
      name: {
        title: '兑换时间',
        type: 'string',
        filter: false
      },
      mobile: {
        title: '会员卡号',
        type: 'string',
        filter: false
      },
      exchangeItem: {
        title: '兑换内容',
        type: 'string',
        filter: false
      },
      integral: {
        title: '消耗积分',
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

  serviceExchange = {
    mode: 'external',
    actions: {
      columnTitle: '操作',
      edit:false
    },
    hideSubHeader: true,
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },
      name: {
        title: '名称',
        type: 'string',
        filter: false
      },
      serviceItemTxt: {
        title: '服务项目',
        type: 'string',
        filter: false
      },
      integral: {
        title: '所需积分',
        filter: false,
        type: 'string'
      },
      startDate: {
        title: '活动开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '活动结束日期',
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

  configHouseExchange: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '房型',
      name: 'houseTypeId',
      options: []
    },
    {
      type: 'input',
      label: '所需积分',
      name: 'integral',
      placeholder: '输入所需积分',
    },
    {
      type: 'datepicker',
      label: '活动开始日期',
      name: 'startDate',
      placeholder: '输入活动开始日期',
    },
    {
      type: 'datepicker',
      label: '活动结束日期',
      name: 'endDate',
      placeholder: '输入活动结束日期',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  configServiceExchange: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '服务项目',
      name: 'serviceItemId',
      options: []
    },
    {
      type: 'input',
      label: '所需积分',
      name: 'integral',
      placeholder: '输入所需积分',
    },
    {
      type: 'datepicker',
      label: '活动开始日期',
      name: 'startDate',
      placeholder: '输入活动开始日期',
    },
    {
      type: 'datepicker',
      label: '活动结束日期',
      name: 'endDate',
      placeholder: '输入活动结束日期',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  sourceHouseExchange: LocalDataSource = new LocalDataSource();
  sourceServiceExchange: LocalDataSource = new LocalDataSource();
  modalConfig: any = {};

  constructor(
    private modalService: NgbModal,
    private exchangeService: ExchangeService,
    private houseTypeService: HouseTypeService,
    private serviceItemService:ServiceItemService,
    private _common:Common,
    private _state: GlobalState) {
    this.getDataList('');
  }
  ngOnInit() {
    this.modalConfig.SetHouseExchange = this.configHouseExchange;
    this.modalConfig.SetServiceExchange = this.configServiceExchange;
  }
  ngAfterViewInit() {

  }

  getDataList(modalname): void {

    this.loading = true;
    this.exchangeService.getMembers('SetCardExchange').then((data) => {
      const housetype = _.filter(data, function (o) { return o.houseTypeId > 0; });
      this.sourceHouseExchange.load(housetype);
      const serviceItem = _.filter(data, function (o) { return o.serviceItemId > 0; });
      this.sourceServiceExchange.load(serviceItem);
      this.loading = false;
    });

    //房型
    this.houseTypeService.getHouseTypes().then((data)=>{
      let house = [];
      _.each(data, f => {
        house.push({ id: f['id'], name: f['typeName'] });
      });
      let cfg = _.find(this.configHouseExchange, f => { return f['name'] == 'houseTypeId'; });
      if (cfg) {
        cfg.options = house;
      }
    });
    //服务项目
    this.serviceItemService.getServiceItems().then((data) => {
      let service = [];
      _.each(data, f => {
        service.push({ id: f['id'], name: f['name'] });
      });
      let cfg = _.find(this.configServiceExchange, f => { return f['name'] == 'serviceItemId'; });
      if (cfg) {
        cfg.options = service;
      }
    })
  }

  onCreate(modalname,config, title) {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.config = this.modalConfig[config];
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      let rst = JSON.parse(result);
      if (rst.startDate) {
        rst.startDate = this._common.getDateString2(rst.startDate);
      }
      if (rst.endDate) {
        rst.endDate = this._common.getDateString2(rst.endDate);
      }
      that.exchangeService.create(modalname, rst).then((data) => {
        closeBack();
        const msg = "新增成功。";
        that._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        that.getDataList(modalname);
      },
        (err) => {
          that._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
          
        }
      )
    };
  }

  //删除
  onDelete(modalname, event) {
    if (window.confirm('你确定要删除吗?')) {
      this.exchangeService.delete(modalname, event.data.id).then((data) => {
        const msg = "删除成功。";
        this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        this.getDataList(modalname);
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      });
    }
  }
}
