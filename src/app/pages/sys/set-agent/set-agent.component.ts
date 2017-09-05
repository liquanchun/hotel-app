import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { SetAgentService } from './set-agent.services';
import { GlobalState } from '../../../global.state';
import { DateTimeComponent } from '../../components/dateTimeRender/dateTimeRender.component';
import { DatepickerViewComponent } from '../../components/datepickerView/datepickerView.component';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-set-agent',
  templateUrl: './set-agent.component.html',
  styleUrls: ['./set-agent.component.scss'],
  providers: [SetAgentService],
})
export class SetAgentComponent implements OnInit, AfterViewInit {

  query: string = '';

  settings = {
    actions: {
      columnTitle: '操作'
    },
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: false,
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
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
        width: '100px',
        filter: false,
      },
      linkMan: {
        title: '联系人',
        type: 'string',
        filter: false,
        width: '80px',
      },
      mobile: {
        title: '电话',
        type: 'number',
        filter: false,
        width: '80px',
      },
      contractNo: {
        title: '合同号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      contractDate1: {
        title: '合同开始日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      contractDate2: {
        title: '合同截止日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      accountFee: {
        title: '挂账金额',
        type: 'number',
        filter: false,
        editable: false,
      },
      commissionType: {
        title: '返佣模式',
        type: 'string',
        filter: false,
        width: '80px',
        editor: {
          type: 'list',
          config: {
            list: [{ value: '按单', title: '按单' }, { value: '按金额', title: '按金额' }],
          },
        },
      },
      commissionRate: {
        title: '返佣点数',
        type: 'number',
        filter: false,
        width: '80px',
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private setAgentService: SetAgentService,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'name', search: query },
      { field: 'linkMan', search: query },
      { field: 'mobile', search: query },
    ], false);
  }
  getDataList(): void {
    this.setAgentService.getSetAgents().then((data) => {
      this.source.load(data);
    });
  }
  // 新增
  onCreateConfirm(event): void {
    if (event.newData) {
      this.setAgentService.create(event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 修改
  onSaveConfirm(event): void {
    if (event.newData && event.newData.id) {
      this.setAgentService.update(event.newData.id, event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 删除
  onDeleteConfirm(event): void {
    if (window.confirm('你确定要删除吗?')) {
      this.setAgentService.delete(event.data.id).then((data) => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

}
