import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbdModalContent } from '../../../modal-content.component';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { QueryService } from './query.services';
import { SettingService } from '../setting/setting.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
  providers: [QueryService, SettingService],
})
export class QueryComponent implements OnInit {

  title = '会员信息管理';
  query: string = '';
  loading = false;

  settings = {
    mode: 'external',
    hideSubHeader: true,
    actions: {
      columnTitle: '操作'
    },
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
      },
      name: {
        title: '姓名',
        type: 'string',
        filter: false,
      },
      mobile: {
        title: '手机号',
        type: 'string',
        filter: false,
      },
      wechat: {
        title: '微信号',
        type: 'string',
        filter: false,
      },
      idCardNo: {
        title: '身份证',
        type: 'string',
        filter: false,
      },
      address: {
        title: '地址',
        type: 'string',
        filter: false,
      },
      cardTypeTxt: {
        title: '会员类别',
        type: 'string',
        filter: false,
      },
      sumConsume: {
        title: '累计消费',
        type: 'number',
        filter: false
      },
      sumIntegral: {
        title: '累计积分',
        type: 'number',
        filter: false
      },
      remainIntegral: {
        title: '剩余积分',
        type: 'number',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false,
      },
    }
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '姓名',
      name: 'name',
      placeholder: '输入姓名',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '手机号码',
      name: 'mobile',
      placeholder: '输入手机号码',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '身份证',
      name: 'idCardNo',
      placeholder: '输入身份证',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '微信',
      name: 'wechat',
      placeholder: '输入微信',
    },
    {
      type: 'input',
      label: '地址',
      name: 'address',
      placeholder: '输入地址',
    },
    {
      type: 'select',
      label: '会员卡类型',
      name: 'cardTypeId',
      options: []
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private modalService: NgbModal,
    private memberService: QueryService,
    private settingService: SettingService,
    private _common: Common,
    private _state: GlobalState) {
  }
  ngOnInit() {
    this.getDataList();
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'name', search: query },
      { field: 'mobile', search: query },
      { field: 'wechat', search: query },
    ], false);
  }

  getDataList(): void {
    this.loading = true;
    this.memberService.getMembers().then((data) => {
      this.source.load(data);
      this.loading = false;
    });

    //会员卡类型
    this.settingService.getMembers("SetCard").then((data) => {
      let card = [];
      _.each(data, f => {
        card.push({ id: f['id'], name: f['name'] });
      });
      let cfg = _.find(this.config, f => { return f['name'] == 'cardTypeId'; });
      if (cfg) {
        cfg.options = card;
      }
    })
  }

  newMember() {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增会员';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.memberService.create(JSON.parse(result)).then((data) => {
        closeBack();
        const msg = "新增成功。";
        that._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        that.getDataList();
      },
        (err) => {
          that._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });

        }
      )
    };
  }

  onEdit(event) {
    console.log(event);
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增会员';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.formValue = event.data;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.memberService.update(event.data.id, JSON.parse(result)).then((data) => {
        closeBack();
        const msg = "修改成功。";
        that._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        that.getDataList();
      },
        (err) => {
          that._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });

        }
      )
    };
  }
  //删除
  onDelete(event) {
    if (window.confirm('你确定要删除吗?')) {
      this.memberService.delete(event.data.id).then((data) => {
        const msg = "删除成功。";
        this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        this.getDataList();
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });

      });
    }
  }
}
