import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbdModalContent } from '../../../modal-content.component'
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { ExchangeService } from './exchange.services';
import { HouseTypeService } from '../../market/house-type//house-type.services';
import { GlobalState } from '../../../global.state';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  providers: [ExchangeService, HouseTypeService],
})
export class ExchangeComponent implements OnInit, AfterViewInit {
  loading = false;
  query: string = '';

  exchangesInteExchange = {
    mode: 'external',
    actions: {
      columnTitle: '操作'
    },
    hideSubHeader: true,
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      confirmSave: true,
    },
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
      exchangeType: {
        title: '兑换类型',
        type: 'string',
        filter: false
      },
      cardTypeTxt: {
        title: '会员卡类型',
        filter: false,
        type: 'string',
      },
      giftName: {
        title: '礼品名称',
        type: 'string',
        filter: false
      },
      exchangeInte: {
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

  exchangesInteHouse = {
    mode: 'external',
    actions: {
      columnTitle: '操作'
    },
    hideSubHeader: true,
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      confirmSave: true,
    },
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
      takeInte: {
        title: '所需积分',
        type: 'number',
        filter: false
      },
      cardTypeTxt: {
        title: '会员卡类型',
        filter: false,
        type: 'string'
      },
      houseTypeTxt: {
        title: '兑换房型',
        type: 'string',
        filter: false
      },
      useWeeks: {
        title: '有效星期',
        type: 'string',
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

  configInteExchange: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '兑换类型',
      name: 'exchangeType',
      placeholder: '输入兑换类型',
      validation: [Validators.required],
    },
    {
      type: 'check',
      label: '会员卡类型',
      name: 'cardType',
      check: 'radio',
      options: []
    },
    {
      type: 'input',
      label: '礼品名称',
      name: 'giftName',
      placeholder: '输入礼品名称',
    },
    {
      type: 'input',
      label: '所需积分',
      name: 'exchangeInte',
      placeholder: '输入所需积分',
    },
    {
      type: 'input',
      label: '活动开始日期',
      name: 'startDate',
      placeholder: '输入活动开始日期',
    },
    {
      type: 'input',
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

  configInteHouse: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '所需积分',
      name: 'takeInte',
      placeholder: '输入所需积分',
      validation: [Validators.required],
    },
    {
      type: 'check',
      label: '会员卡类型',
      name: 'cardType',
      check: 'radio',
      options: []
    },
    {
      type: 'select',
      label: '兑换房型',
      name: 'houseType',
      options: []
    },
    {
      type: 'multiselect',
      label: '有效星期',
      name: 'useWeeks',
      options: []
    },
    {
      type: 'input',
      label: '活动开始日期',
      name: 'startDate',
      placeholder: '输入活动开始日期',
    },
    {
      type: 'input',
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

  sourceInteExchange: LocalDataSource = new LocalDataSource();
  sourceInteHouse: LocalDataSource = new LocalDataSource();
  modalConfig: any = {};

  constructor(
    private modalService: NgbModal,
    private memberService: ExchangeService,
    private houseTypeService: HouseTypeService,
    private _state: GlobalState) {
    this.getDataList('');
  }
  ngOnInit() {
    this.modalConfig.SetInteExchange = this.configInteExchange;
    this.modalConfig.SetInteHouse = this.configInteHouse;
  }
  ngAfterViewInit() {

  }

  getDataList(modalname): void {
    if (!modalname || modalname == 'SetInteExchange') {
      this.memberService.getMembers('SetInteExchange').then((data) => {
        this.sourceInteExchange.load(data);
      });
    }

    if (!modalname || modalname == 'SetInteHouse') {
      this.memberService.getMembers('SetInteHouse').then((data) => {
        let cardT1 = _.find(this.configInteHouse, function (f) { return f.name == 'useWeeks'; });
        cardT1.options = [
          { id: '星期一', name: '星期一' },
          { id: '星期二', name: '星期二' },
          { id: '星期三', name: '星期三' },
          { id: '星期四', name: '星期四' },
          { id: '星期五', name: '星期五' },
          { id: '星期六', name: '星期六' },
          { id: '星期日', name: '星期日' },
        ];
        this.sourceInteHouse.load(data);
      });
    }

    this.houseTypeService.getHouseTypes().then((data) => {
      let cardT1 = _.find(this.configInteHouse, function (f) { return f.name == 'houseType'; });
      _.each(data, (d) => {
        cardT1.options.push({ id: d.id, name: d.typeName });
      });
    });
  }

  onCreate(modalname, title) {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.config = this.modalConfig[modalname];
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.memberService.create(modalname, JSON.parse(result)).then((data) => {
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
