import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { NgbdModalContent } from '../../../modal-content.component'

import { TemplateService } from './template.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  providers: [TemplateService],
})
export class TemplateComponent implements OnInit {

  loading = false;
  title = '短信模板';
  query: string = '';

  settings = {
    mode: 'external',
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
    hideSubHeader: true,
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
      },
      tmp_name: {
        title: '模板名称',
        type: 'string',
        filter: false,
      },
      to_business: {
        title: '所属业务',
        type: 'string',
        filter: false,
      },
      tmp_content: {
        title: '模板内容',
        type: 'string',
        filter: false,
      },
      createdAt: {
        title: '操作时间',
        type: 'string',
        filter: false,
      },
      createdBy: {
        title: '操作人',
        type: 'string',
        filter: false
      },
    }
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '模板名称',
      name: 'tmp_name',
      placeholder: '输入模板名称',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '所属业务',
      name: 'to_business',
      placeholder: '输入所属业务',
    },
    {
      type: 'textarea',
      label: '模板内容',
      name: 'tmp_content',
      placeholder: '输入模板内容',
    }
  ];

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private modalService: NgbModal,
    private templateService: TemplateService,
    private _common: Common,
    private _state: GlobalState) {
  }
  ngOnInit() {
    this.getDataList();
  }
  newHouse() {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增模板信息';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.templateService.create(JSON.parse(result)).then((data) => {
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

  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'code', search: query },
      { field: 'tags', search: query },
      { field: 'state', search: query },
    ], false);
  }

  onEdit(event) {
    console.log(event);
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '修改模板信息';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.formValue = event.data;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.templateService.update(event.data.id, JSON.parse(result)).then((data) => {
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
      this.templateService.delete(event.data.id).then((data) => {
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
    this.templateService.getTemplates().then((data) => {
      this.source.load(data);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      
    });
  }
}
