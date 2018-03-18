import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { NgbdModalContent } from '../../../modal-content.component'
import { SendrecordService } from './sendrecord.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-sendrecord',
  templateUrl: './sendrecord.component.html',
  styleUrls: ['./sendrecord.component.scss'],
  providers: [SendrecordService],
})
export class SendrecordComponent implements OnInit {

  loading = false;
  title = '发送记录';
  query: string = '';

  settings = {
    mode: 'external',
    selectMode: 'multi',
    actions: {
      columnTitle: '操作',
      edit:false
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    hideSubHeader: true,
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
      },
      createdAt: {
        title: '发送时间',
        type: 'string',
        filter: false,
      },
      mobile: {
        title: '手机号码',
        type: 'string',
        filter: false,
      },
      business: {
        title: '业务',
        type: 'string',
        filter: false,
      },
      content: {
        title: '内容',
        type: 'string',
        filter: false,
      },
      status: {
        title: '状态',
        type: 'string',
        filter: false,
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private modalService: NgbModal,
    private sendrecordService: SendrecordService,
    private _common: Common,
    private _state: GlobalState) {
  }
  ngOnInit() {
    this.getDataList();
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'mobile', search: query },
      { field: 'content', search: query },
    ], false);
  }

  //删除
  onDelete(event) {
    if (window.confirm('你确定要删除吗?')) {
      this.sendrecordService.delete(event.data.id).then((data) => {
        const msg = "删除成功。";
        this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        this.getDataList();
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      });
    }
  }

  getDataList(): void {
    this.loading = true;
    this.sendrecordService.getSendrecords().then((data) => {
      this.source.load(data);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      
    });
  }
}
