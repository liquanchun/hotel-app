import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbdModalContent } from '../../../modal-content.component'
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { UserService } from './../../sys/components/user/user.services';

import { HousestateService } from './housestate.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import { DicService } from '../../sys/dic/dic.services';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-housestate',
  templateUrl: './housestate.component.html',
  styleUrls: ['./housestate.component.scss'],
  providers: [HousestateService, DicService, UserService],
})
export class HousestateComponent implements OnInit, AfterViewInit {

  loading = false;
  title = '房态管理';
  query: string = '';
  source: any;
  sourcefilter: any;
  houseState: any;

  //状态按钮组
  stateData = [];
  //入住标准钮组
  checkInData = [
  ];
  //入住渠道
  channelData = [
  ];
  //入住房间的方式统计
  houseCheckIns = [];
  //客源
  custData = [];

  configClear: FieldConfig[] = [
    {
      type: 'input',
      label: '房间号',
      name: 'houseCode',
      placeholder: '',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '打扫工人',
      name: 'cleanMan',
      options: [],
      placeholder: '选择打扫工人',
      validation: [Validators.required],
    }
  ];

  configRepair: FieldConfig[] = [
    {
      type: 'input',
      label: '房间号',
      name: 'houseCode',
      placeholder: '',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '维修原因',
      name: 'reason',
      placeholder: '输入维修原因',
    },
    {
      type: 'select',
      label: '维修工人',
      name: 'repairMan',
      options: [],
      placeholder: '选择维修工人',
      validation: [Validators.required],
    }
  ];

  constructor(
    private modalService: NgbModal,
    private housestateService: HousestateService,
    private _dicService: DicService,
    private _common: Common,
    private _userService: UserService,
    private _state: GlobalState) {
    this.onGetUsers();
  }
  ngOnInit() {
    this.getDataList();
  }
  ngAfterViewInit() {

  }
  onSearch(query: string = '') {
    this.source = _.filter(this.sourcefilter, function (o) {
      return o['code'] && o['code'].indexOf(query) > -1
        || o['stateTxt'] && o['stateTxt'].indexOf(query) > -1
        || o['houseTypeTxt'] && o['houseTypeTxt'].indexOf(query) > -1
        || o['tags'] && o['tags'].indexOf(query) > -1;
    });
  }
  //获取用户信息
  onGetUsers(): void {
    this._userService.getUsers().then((data) => {
      let usrList = [];
      _.each(data, d => {
        usrList.push({ id: d.userId, name: d.userName });
      });
      let clr = _.find(this.configClear, f => { return f.name == 'cleanMan' });
      if (clr) {
        clr.options = usrList;
      }
      let rpi = _.find(this.configRepair, f => { return f.name == 'repairMan' });
      if (rpi) {
        rpi.options = usrList;
      }
    });
  }
  //房扫
  onClear(code: string, state: string): void {
    console.log(code);
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '房扫信息';
    modalRef.componentInstance.config = this.configClear;
    modalRef.componentInstance.formValue = { houseCode: code };
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      let clr = JSON.parse(result);
      clr.createdBy = state;
      that.housestateService.clear(clr).then((data) => {
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
  //维修
  onRepair(code: string, state: string): void {
    console.log(code);
    const that = this;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = '维修信息';
    modalRef.componentInstance.config = this.configRepair;
    modalRef.componentInstance.formValue = { houseCode: code };
    modalRef.componentInstance.saveFun = (result, closeBack) => {
      let rpi = JSON.parse(result);
      rpi.createdBy = state;
      that.housestateService.repair(rpi).then((data) => {
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

  getDataListById(id: number): void {
    this.source = _.filter(this.sourcefilter, (f) => { return f['state'] == id; });
  }

  getDataList(): void {
    // this._dicService.getDicByName('客源', (data) => { this.custData = data; });

    this._dicService.getDicByName('房屋状态', (data) => {
      this.stateData = data;

      this.housestateService.getHousestates().then((data) => {
        this.source = data;
        this.sourcefilter = data;
        this.houseState = _.countBy(data, 'state');
        const that = this;
        _.each(this.stateData, (e) => {
          if (that.houseState[e.id]) {
            e.count = that.houseState[e.id];
          } else {
            e.count = 0;
          }
        });
      });

      this.housestateService.getHouseCheckIn().then((data) => {
        if (data) {
          this.houseCheckIns = data["houseCheckIns"];
          this.checkInData = data["houseInTypeList"];
          this.channelData = data["houseComeTypeList"];
        }
      })

    });
  }

  SearchInType(intype) {
    const that = this;
    if (this.houseCheckIns) {
      this.source = _.filter(this.sourcefilter, function (o) {
        let intypes = _.filter(that.houseCheckIns, (f) => { return f["inType"] == intype; });
        return _.some(intypes, ['code', o['code']]);
      })
    }
  }

  SearchComeType(cometype) {
    const that = this;
    if (this.houseCheckIns) {
      this.source = _.filter(this.sourcefilter, function (o) {
        let intypes = _.filter(that.houseCheckIns, (f) => { return f["comeType"] == cometype; });
        return _.some(intypes, ['code', o['code']]);
      })
    }
  }

  refresh(){
    this.source = this.sourcefilter;
  }
}
