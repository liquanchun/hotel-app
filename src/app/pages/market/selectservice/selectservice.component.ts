import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { NgbdModalContent } from '../../../modal-content.component'
import { SelectServiceService } from './SelectService.services';
import { ServiceItemService } from './../serviceitem/serviceitem.services';
import { GlobalState } from '../../../global.state';
import { DicService } from '../../sys/dic/dic.services';
import { Common } from '../../../providers/common';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-selectservice',
  templateUrl: './SelectService.component.html',
  styleUrls: ['./SelectService.component.scss'],
  providers: [SelectServiceService, ServiceItemService],
})
export class SelectServiceComponent implements OnInit, AfterViewInit {

  @Input() isNewService: boolean = true;

  loading = false;
  query: string = '';

  newSettings;
  settings = {
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
      itemCode: {
        title: '项目代码',
        type: 'string',
        filter: false
      },
      itemName: {
        title: '项目名称',
        type: 'string',
        filter: false
      },
      price: {
        title: '价格',
        type: 'number',
        filter: false
      },
      times: {
        title: '次数',
        type: 'number',
        filter: false
      },
      serviceTime: {
        title: '预约时间',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      },
    }
  };

  config: FieldConfig[] = [
    {
      type: 'multiselect',
      label: '选择服务项目',
      name: 'serviceId',
      options: [],
    },
    {
      type: 'input',
      label: '次数',
      name: 'times',
      placeholder: '输入次数',
      value: 1
    },
    {
      type: 'datepicker',
      label: '预约时间',
      name: 'serviceTime',
      time: '15:30',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    }
  ];

  source: LocalDataSource = new LocalDataSource();
  serviceItemData = [];
  selectedItem = [];

  constructor(
    private modalService: NgbModal,
    private _selectServiceService: SelectServiceService,
    private _serviceItemService: ServiceItemService,
    private _dicService: DicService,
    private _common: Common,
    private _state: GlobalState) {
  }
  ngOnInit() {
    if (this.isNewService) {
      this.settings['actions'] = {
        columnTitle: '操作',
        edit: true,
        delete: true
      };
    } else {
      this.settings['actions'] = false;
    }
    this.newSettings = Object.assign({}, this.settings);
    this.getDataList();
  }
  ngAfterViewInit() {

  }
  getDataList(): void {
    this._serviceItemService.getServiceItems().then((data) => {
      this.serviceItemData = data;
      const selectSer = [];
      _.each(data, (f) => {
        selectSer.push({ id: f['id'], name: f['name'] });
      });
      let cfg = _.find(this.config, f => { return f['name'] == 'serviceId'; });
      if (cfg) {
        cfg.options = selectSer;
      }
    }, (err) => {
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
    });
  }

  newService() {
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '新增服务项目';
    modalRef.componentInstance.config = this.config;
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      const newSer = JSON.parse(result);
      if (newSer.serviceTime) {
        newSer.serviceTime = this._common.getDateString2(newSer.serviceTime);
      }
      const findSer = _.find(this.serviceItemData, f => { return f['id'] == newSer['serviceId']; })
      if (findSer) {
        findSer['times'] = newSer['times'];
        findSer['serviceTime'] = newSer['serviceTime'];
        findSer['remark'] = newSer['remark'];
        this.selectedItem.push(findSer);
        this.source.load(this.selectedItem);
      }
      closeBack();
    };
  }

  // 删除
  onDeleteConfirm(event): void {
    if (window.confirm('你确定要删除吗?')) {
      _.remove(this.selectedItem, function (n) {
        return n['id'] == event.data.id;
      });
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    event.confirm.resolve();
  }
  //清除表格数据
  clearData() {
    this.source.empty();
    this.source.reset();
    this.selectedItem = [];
  }
  setDisableEdit(enable: boolean) {
    this.isNewService = enable;
  }
  //按照订单号加载服务项目
  loadData(orderNo: string) {
    this._selectServiceService.getSelectServices(orderNo).then((data) => {
      this.selectedItem = data;
      this.source.load(data);
    }, (err) => {
      this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
    });
  }
}
