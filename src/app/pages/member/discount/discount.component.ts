import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbdModalContent } from '../../../modal-content.component'
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { DiscountService } from './discount.services';
import { HouseTypeService } from '../../market/house-type//house-type.services';
import { GlobalState } from '../../../global.state';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  providers: [DiscountService, HouseTypeService],
})
export class DiscountComponent implements OnInit, AfterViewInit {
  loading = false;
  query: string = '';

  discountsCard = {
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
        title: '会员卡',
        type: 'string',
        filter: false
      },
      level: {
        title: '级别',
        type: 'number',
        filter: false
      },
      cardFee: {
        title: '卡费',
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

  discountsIntegral = {
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
      inteType: {
        title: '方式类型',
        type: 'string',
        filter: false
      },
      cardTypeTxt: {
        title: '会员卡类型',
        type: 'string',
        filter: false
      },
      dayOrFee: {
        title: '天数/金额',
        type: 'number',
        filter: false
      },
      integral: {
        title: '积分',
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

  configCard: FieldConfig[] = [
    {
      type: 'input',
      label: '会员卡',
      name: 'name',
      placeholder: '输入会员卡',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '级别',
      name: 'level',
      placeholder: '输入级别',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '卡费',
      name: 'cardFee',
      placeholder: '输入卡费',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  configIntegral: FieldConfig[] = [
    {
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '方式类型',
      name: 'type',
      placeholder: '输入方式类型',
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
      label: '金额',
      name: 'dayOrFee',
      placeholder: '输入金额',
    },
    {
      type: 'input',
      label: '积分',
      name: 'integral',
      placeholder: '输入积分',
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

  sourceCard: LocalDataSource = new LocalDataSource();
  sourceIntegral: LocalDataSource = new LocalDataSource();
  modalConfig: any = {};

  constructor(
    private modalService: NgbModal,
    private memberService: DiscountService,
    private houseTypeService: HouseTypeService,
    private _state: GlobalState) {
    this.getDataList('');
  }
  ngOnInit() {
    this.modalConfig.SetCard = this.configCard;
    this.modalConfig.SetIntegral = this.configIntegral;
  }
  ngAfterViewInit() {

  }

  getDataList(modalname): void {
    if (!modalname || modalname == 'SetCard') {
      this.loading = true;
      this.memberService.getMembers('SetCard').then((data) => {
        this.sourceCard.load(data);
        this.loading = false;
        const that = this;
        let cardT1 = _.find(this.configIntegral, function (f) { return f.name == 'cardType'; });

        _.each(data, function (d) {
          cardT1.options.push({ id: d.id, name: d.name });
        });
      }, (err) => {
        this.loading = false;
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      });
    }

    if (!modalname || modalname == 'SetIntegral') {
      this.memberService.getMembers('SetIntegral').then((data) => {
        this.sourceIntegral.load(data);
      });
    }
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
