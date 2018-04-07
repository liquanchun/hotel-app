import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { NgbdModalContent } from '../../../modal-content.component';
import { ServiceItemService } from './serviceitem.services';
import { GlobalState } from '../../../global.state';
import { DicService } from '../../sys/dic/dic.services';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-serviceitem',
  templateUrl: './serviceitem.component.html',
  styleUrls: ['./serviceitem.component.scss'],
  providers: [ServiceItemService],
})
export class ServiceItemComponent implements OnInit, AfterViewInit {

  loading = false;
  query: string = '';

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
        width: '30px',
      },
      typeName: {
        title: '服务类别',
        type: 'string',
        filter: false
      },
      name: {
        title: '项目名称',
        type: 'string',
        filter: false
      },
      itemCode: {
        title: '项目代码',
        type: 'string',
        filter: false
      },
      unit: {
        title: '单位',
        type: 'string',
        filter: false
      },
      price: {
        title: '价格',
        type: 'number',
        filter: false
      },
      integral: {
        title: '积分',
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

  config: FieldConfig[] = [
    {
      type: 'select',
      label: '服务类别',
      name: 'typeId',
      options: [],
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '项目名称',
      name: 'name',
      placeholder: '输入项目名称',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '项目代码',
      name: 'itemCode',
      placeholder: '输入项目代码',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '单位',
      name: 'unit',
      placeholder: '输入单位',
    },
    {
      type: 'input',
      label: '价格',
      name: 'price',
      placeholder: '输入价格',
    },
    {
      type: 'input',
      label: '积分',
      name: 'integral',
      placeholder: '输入积分',
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
    private serviceItemService: ServiceItemService,
    private _dicService: DicService,
    private _state: GlobalState) {
  }
  ngOnInit() {
    this.getDataList();
    this.onGetServiceType();
  }
  ngAfterViewInit() {

  }
  onGetServiceType() {
    this._dicService.getDicByName('服务类别', (data) => {
      let cfg = _.find(this.config, f => { return f['name'] == 'typeId'; });
      if (cfg) {
        cfg.options = data;
      }
    });
  }
  getDataList(): void {
    this.loading = true;
    this.serviceItemService.getServiceItems().then((data) => {
      this.source.load(data);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      
    });
  }

  newService() {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增服务项目';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.serviceItemService.create(JSON.parse(result)).then((data) => {
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
    modalRef.componentInstance.title = '修改服务项目';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.formValue = event.data;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.serviceItemService.update(event.data.id, JSON.parse(result)).then((data) => {
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
      this.serviceItemService.delete(event.data.id).then((data) => {
        const msg = "删除成功。";
        this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        this.getDataList();
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      });
    }
  }

}
