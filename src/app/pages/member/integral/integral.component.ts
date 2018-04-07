import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbdModalContent } from '../../../modal-content.component'
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { IntegralService } from './integral.services';
import { HouseTypeService } from '../../market/house-type//house-type.services';
import { SettingService } from '../setting/setting.services';
import { ServiceItemService } from '../../market/serviceitem/serviceitem.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member-integral',
  templateUrl: './integral.component.html',
  styleUrls: ['./integral.component.scss'],
  providers: [IntegralService, HouseTypeService, SettingService,ServiceItemService],
})
export class IntegralComponent implements OnInit, AfterViewInit {
  loading = false;
  query: string = '';

  houseIntegral = {
    mode: 'external',
    actions: {
      columnTitle: '操作',
      edit: false
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
      cardTypeTxt: {
        title: '卡类型',
        type: 'string',
        filter: false
      },
      houseTypeTxt: {
        title: '房型',
        type: 'string',
        filter: false
      },
      integral: {
        title: '积分',
        type: 'number',
        filter: false
      },
      startDate: {
        title: '开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '结束日期',
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

  serviceIntegral = {
    mode: 'external',
    actions: {
      columnTitle: '操作',
      edit: false
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
      cardTypeTxt: {
        title: '卡类型',
        type: 'string',
        filter: false
      },
      serviceItemTxt: {
        title: '服务项目',
        type: 'string',
        filter: false
      },
      integral: {
        title: '积分',
        type: 'number',
        filter: false
      },
      startDate: {
        title: '开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '结束日期',
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


  configIntegral: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '会员卡类型',
      name: 'cardTypeId',
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
      label: '积分',
      name: 'integral',
      placeholder: '输入积分',
    },
    {
      type: 'datepicker',
      label: '开始日期',
      name: 'startDate',
      placeholder: '输入开始日期',
    },
    {
      type: 'datepicker',
      label: '结束日期',
      name: 'endDate',
      placeholder: '输入结束日期',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  configService: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '会员卡类型',
      name: 'cardTypeId',
      options: []
    },
    {
      type: 'select',
      label: '服务项目',
      name: 'serviceItemId',
      options: []
    },
    {
      type: 'input',
      label: '积分',
      name: 'integral',
      placeholder: '输入积分',
    },
    {
      type: 'datepicker',
      label: '开始日期',
      name: 'startDate',
      placeholder: '输入开始日期',
    },
    {
      type: 'datepicker',
      label: '结束日期',
      name: 'endDate',
      placeholder: '输入结束日期',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  sourceHouseIntegral: LocalDataSource = new LocalDataSource();
  sourceServiceIntegral: LocalDataSource = new LocalDataSource();
  modalConfig: any = {};

  constructor(
    private modalService: NgbModal,
    private memberService: IntegralService,
    private houseTypeService: HouseTypeService,
    private settingService: SettingService,
    private serviceItemService:ServiceItemService,
    private _common:Common,
    private _state: GlobalState) {
    this.getDataList('');
  }
  ngOnInit() {
    this.modalConfig.SetIntegral = this.configIntegral;
    this.modalConfig.SetService = this.configService;
  }
  ngAfterViewInit() {

  }

  getDataList(modalname): void {

    this.loading = true;
    if (!modalname || modalname == 'SetIntegral') {
      this.memberService.getMembers('SetIntegral').then((data) => {
        const housetype = _.filter(data, function (o) { return o.houseTypeId > 0; });
        this.sourceHouseIntegral.load(housetype);
        const serviceItem = _.filter(data, function (o) { return o.serviceItemId > 0; });
        this.sourceServiceIntegral.load(serviceItem);
        this.loading = false;
      });
    }
    //会员卡类型
    this.settingService.getMembers("SetCard").then((data) => {
      let card = [];
      _.each(data, f => {
        card.push({ id: f['id'], name: f['name'] });
      });
      let cfg = _.find(this.configIntegral, f => { return f['name'] == 'cardTypeId'; });
      if (cfg) {
        cfg.options = card;
      }

      let cfg2 = _.find(this.configService, f => { return f['name'] == 'cardTypeId'; });
      if (cfg2) {
        cfg2.options = card;
      }
    })
    //房型
    this.houseTypeService.getHouseTypes().then((data)=>{
      let house = [];
      _.each(data, f => {
        house.push({ id: f['id'], name: f['typeName'] });
      });
      let cfg = _.find(this.configIntegral, f => { return f['name'] == 'houseTypeId'; });
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
      let cfg = _.find(this.configService, f => { return f['name'] == 'serviceItemId'; });
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
      // if(rst.houseType){
      //   rst.houseTypeTxt = rst.houseType.toString();
      // }
      // if(rst.serviceItem){
      //   rst.serviceItemTxt = rst.serviceItem.toString();
      // }
      if (rst.startDate) {
        rst.startDate = this._common.getDateString2(rst.startDate);
      }
      if (rst.endDate) {
        rst.endDate = this._common.getDateString2(rst.endDate);
      }
      console.log(rst);
      that.memberService.create(modalname, rst).then((data) => {
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

  onEdit(modalname, title, event) {
    console.log(event);
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.config = this.modalConfig[modalname];
    modalRef.componentInstance.formValue = event.data;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.memberService.update(modalname, event.data.id, JSON.parse(result)).then((data) => {
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
      this.memberService.delete(modalname, event.data.id).then((data) => {
        const msg = "删除成功。";
        this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        this.getDataList(modalname);
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });

      });
    }
  }
}
