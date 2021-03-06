import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';

import { NgbdModalContent } from '../../../modal-content.component'
import { ButtonViewComponent } from './buttonview.component';
import { CusgoodsService } from './cusgoods.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: 'app-cusgoods',
  templateUrl: './cusgoods.component.html',
  styleUrls: ['./cusgoods.component.scss'],
  providers: [CusgoodsService],
})
export class CusgoodsComponent implements OnInit {

  loading = false;
  title = '客人物品管理';
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
      createdAt: {
        title: '存放时间',
        type: 'string',
        filter: false,
      },
      typeName: {
        title: '物品类型',
        type: 'string',
        filter: false,
      },
      goodsName: {
        title: '名称',
        type: 'string',
        filter: false,
      },
      goodsPrice: {
        title: '物品价值',
        type: 'string',
        filter: false,
      },
      cusName: {
        title: '客人姓名',
        type: 'string',
        filter: false
      },
      mobile: {
        title: '联系电话',
        type: 'string',
        filter: false
      },
      houseCode: {
        title: '房间号',
        type: 'string',
        filter: false
      },
      createdBy: {
        title: '存放操作员',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      },
      takeTime: {
        title: '领取时间',
        type: 'string',
        filter: false
      },
      takeBy: {
        title: '领取操作员',
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
        }
      }
    }
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '物品类型',
      name: 'typeName',
      placeholder: '输入物品类型',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '物品名称',
      name: 'goodsName',
      placeholder: '输入物品名称',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '物品价值',
      name: 'goodsPrice',
      placeholder: '输入物品价值',
    },
    {
      type: 'input',
      label: '客人姓名',
      name: 'cusName',
      placeholder: '输入客人姓名',
    },
    {
      type: 'input',
      label: '联系电话',
      name: 'mobile',
      placeholder: '输入联系电话',
    },
    {
      type: 'input',
      label: '房间号',
      name: 'houseCode',
      placeholder: '输入房间号',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    },
  ];

  source: LocalDataSource = new LocalDataSource();

  cusgoods: any;
  selectedEvent: any;

  constructor(
    private modalService: NgbModal,
    private cusgoodsService: CusgoodsService,
    private _common: Common,
    private _state: GlobalState) {

    this._state.subscribe('cusgoods.click', (data) => {
      this.onTake(_.find(this.cusgoods, f => { return f['id'] = data; }));
    });

  }
  ngOnInit() {
    this.getDataList();
  }
  rowClicked(event) {
  }
  onCreate() {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增客人物品';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.cusgoodsService.create(JSON.parse(result)).then((data) => {
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
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '修改客人物品';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      that.cusgoodsService.update(event.data.id, JSON.parse(result)).then((data) => {
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
  onTake(event) {
    event.takeBy = 'admin';
    const that = this;
    that.cusgoodsService.update(event.id, event).then((data) => {
      const msg = "领取成功。";
      that._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
      that.getDataList();
    },
      (err) => {
        that._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      }
    )
  }
  //删除
  onDelete(event) {
    if (window.confirm('你确定要删除吗?')) {
      this.cusgoodsService.delete(event.data.id).then((data) => {
        const msg = "删除成功。";
        this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
        this.getDataList();
      }, (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
        
      });
    }
  }
  //查询
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'cusgoodsMan', search: query },
      { field: 'houseCode', search: query },
      { field: 'createdBy', search: query },
    ], false);
  }

  getDataList(): void {
    this.loading = true;
    this.cusgoodsService.getCusgoodss().then((data) => {
      this.loading = false;
      this.cusgoods = data;
      _.each(data, f => {
        const ub = f.takeBy ? false : true;
        f.button = '领取_' + f.id + '_' + ub;
      });
      this.source.load(data);
    }, (err) => {
      this.loading = false;
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      
    });
  }
}
