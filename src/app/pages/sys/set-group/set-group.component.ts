import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { SetGroupService } from './set-group.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import { DateTimeComponent } from '../../components/dateTimeRender/dateTimeRender.component';
import { DatepickerViewComponent } from '../../components/datepickerView/datepickerView.component';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { DynamicFormComponent }
  from '../../../theme/components/dynamic-form/containers/dynamic-form/dynamic-form.component';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-set-group',
  templateUrl: './set-group.component.html',
  styleUrls: ['./set-group.component.scss'],
  providers: [SetGroupService],
})
export class SetGroupComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  title = '协议单位';
  totalRecord = 89;
  page = 1;
  query: string = '';

  settings = {
    mode: 'external',
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
      address: {
        title: '地址',
        type: 'string',
        filter: false
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
      coupons: {
        title: '早餐券',
        type: 'number',
        filter: false
      },
      accountFee: {
        title: '挂账金额',
        type: 'number',
        filter: false,
        editable: false,
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
      type: 'input',
      label: '名称',
      name: 'name',
      placeholder: '输入名称',
      validation: [Validators.required, Validators.minLength(3)],
    },
    {
      type: 'input',
      label: '联系人',
      name: 'linkMan',
      placeholder: '输入联系人',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '电话',
      name: 'mobile',
      placeholder: '输入电话',
    },
    {
      type: 'input',
      label: '地址',
      name: 'address',
      placeholder: '输入地址',
    },
    {
      type: 'input',
      label: '合同号',
      name: 'contractNo',
      placeholder: '输入合同号',
    },
    {
      type: 'datepicker',
      label: '合同开始日期',
      name: 'contractDate1',
      placeholder: '输入合同开始日期',
    },
    {
      type: 'datepicker',
      label: '合同终止日期',
      name: 'contractDate2',
      placeholder: '输入合同终止日期',
    },
    {
      type: 'input',
      label: '早餐券',
      name: 'coupons',
      placeholder: '输入早餐券',
    },
    {
      type: 'input',
      label: '备注',
      name: 'remark',
      placeholder: '输入备注',
    },
    {
      label: '保存',
      name: 'submit',
      type: 'button',
      callback: this.backTop,
    },
  ];
  source: LocalDataSource = new LocalDataSource();

  private tableDisplay: string = 'block';
  private formDisplay: string = 'none';

  private isNewGroup: boolean = false;
  private editGroup: any;

  private successMessage: string;
  private _success = new Subject<string>();
  private staticAlertClosed = false;
  private alterType: string;

  constructor(
    private setGroupService: SetGroupService,
    private _common: Common,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

    this._state.subscribe('backup-click', (x) => {
      this.isNewGroup = false;
      this.tableDisplay = 'block';
      this.formDisplay = 'none';
    });
  }
  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });

    this.form.setDisabled('submit', true);
  }
  onPageChange(p) {
    console.log("page:" + p);
  }

  onCreate() {
    this.tableDisplay = 'none';
    this.formDisplay = 'block';
    this.isNewGroup = true;
    this.title = '新增协议单位';
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'name', search: query },
      { field: 'linkMan', search: query },
      { field: 'mobile', search: query },
    ], false);
  }

  getDataList(): void {
    this.setGroupService.getSetGroups().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }

  onEdit(event): void {
    this.editGroup = event;
    this.isNewGroup = false;
    this.tableDisplay = 'none';
    this.formDisplay = 'block';
    this.title = '修改协议单位';

    this.form.setValue('name', event.data.name);
    this.form.setValue('linkMan', event.data.linkMan);
    this.form.setValue('mobile', event.data.mobile);
    this.form.setValue('address', event.data.address);
    this.form.setValue('contractNo', event.data.contractNo);
    this.form.setValue('contractDate1', {
      "year": this._common.getDateYear(event.data.contractDate1),
      "month": this._common.getDateMonth(event.data.contractDate1),
      "day": this._common.getDateDay(event.data.contractDate1)
    });
    this.form.setValue('contractDate2', {
      "year": this._common.getDateYear(event.data.contractDate2),
      "month": this._common.getDateMonth(event.data.contractDate2),
      "day": this._common.getDateDay(event.data.contractDate2)
    });
    this.form.setValue('coupons', event.data.coupons);
    this.form.setValue('remark', event.data.remark);
    this.form.setDisabled('submit', false);
  }
  // 新增
  onCreateConfirm(event): void {
    if (event.newData) {
      this.setGroupService.create(event.newData).then((data) => {
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
      this.setGroupService.update(event.newData.id, event.newData).then((data) => {
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
      this.setGroupService.delete(event.data.id).then((data) => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

  changeSuccessMessage(msg) {
    this._success.next(msg);
  }

  submit(value: { [name: string]: any }) {
    const that = this;
    value.contractDate1 = this._common.getDateString(value.contractDate1);
    value.contractDate2 = this._common.getDateString(value.contractDate2);
    if(this.isNewGroup){
      this.setGroupService.create(value).then(function (menu) {
        that.getDataList();
        that.form.setDisabled('submit', false);
        that.changeSuccessMessage(`保存成功。`);
        that.backTop();
      }, (err) => {
        that.alterType = 'danger';
        that.changeSuccessMessage(`保存失败。${err}`);
      });
    } else {
      value.id = this.editGroup.data.id;
      this.setGroupService.update(value.id, value).then(function (menu) {
        that.getDataList();
        that.form.setDisabled('submit', false);
        that.changeSuccessMessage(`保存成功。`);
        that.backTop();
      }, (err) => {
        that.alterType = 'danger';
        that.changeSuccessMessage(`保存失败。${err}`);
      });
    }
  }

  backTop(): void {
    this.isNewGroup = false;
    this.tableDisplay = 'block';
    this.formDisplay = 'none';
  }
}
