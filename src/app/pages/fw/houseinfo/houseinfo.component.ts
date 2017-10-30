import { Component, OnInit, AfterViewInit, ViewChild,Input } from '@angular/core';
import { NgbModal, ModalDismissReasons,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { DynamicFormComponent }
  from '../../../theme/components/dynamic-form/containers/dynamic-form/dynamic-form.component';

import { HouseinfoService } from './houseinfo.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-houseinfo',
  templateUrl: './houseinfo.component.html',
  styleUrls: ['./houseinfo.component.scss'],
  providers: [HouseinfoService],
})
export class HouseinfoComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  closeResult: string;

  title = '房间管理';
  totalRecord = 89;
  page = 1;
  query: string = '';

  settings = {
    mode: 'external',
    actions: {
      columnTitle: '操作'
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
    hideSubHeader: true,
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        filter: false,
        width: '30px',
      },
      code: {
        title: '房号',
        type: 'string',
        filter: false,
        width: '80px',
      },
      floor: {
        title: '楼层',
        type: 'string',
        filter: false,
        width: '80px',
      },
      houseType: {
        title: '房型',
        type: 'string',
        filter: false,
        width: '80px',
      },
      tags: {
        title: '房屋信息',
        type: 'string',
        filter: false,
        width: '80px',
      },
      state: {
        title: '房屋状态',
        type: 'string',
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

  config: FieldConfig[] = [
    {
      type: 'select',
      label: '楼层',
      name: 'floor',
      options: ['6楼', '7楼', '8楼'],
      placeholder: '选择楼层',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '房间编号',
      name: 'code',
      placeholder: '输入房间编号',
      validation: [Validators.required],
    },
    {
      type: 'check',
      label: '房间类型',
      name: 'houseType',
      check: 'radio',
      options: [
        { id: '标准房', name: '标准房' },
        { id: '豪华单间', name: '豪华单间' },
      ]
    },
    {
      type: 'input',
      label: '房间特征',
      name: 'tags',
      placeholder: '输入房间特征',
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
    private houseinfoService: HouseinfoService,
    private _common: Common,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
  onPageChange(p) {
    console.log("page:" + p);
  }
  onCreate() {

  }
  newHouse(content){
    const that = this;
    this.modalService.open(content,
      { windowClass: 'dark-modal' }
    ).result.then((result) => {
      if(result !== 'no'){
         console.log(result);
        that.houseinfoService.create(JSON.parse(result)).then(
          function(v){
            that.getDataList();
          },
          (err)=>{}
        )
      }
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  onSearch(query: string = '') {
    this.source.setFilter([
      { field: 'code', search: query },
      { field: 'tags', search: query },
      { field: 'state', search: query },
    ], false);
  }

  getDataList(): void {
    this.houseinfoService.getHouseinfos().then((data) => {
      this.source.load(data);
      this.totalRecord = data.length;
    });
  }
}
