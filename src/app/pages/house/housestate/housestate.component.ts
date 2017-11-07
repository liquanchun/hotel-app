import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbdModalContent } from '../../../modal-content.component'

import { HousestateService } from './housestate.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-housestate',
  templateUrl: './housestate.component.html',
  styleUrls: ['./housestate.component.scss'],
  providers: [HousestateService],
})
export class HousestateComponent implements OnInit, AfterViewInit {

  title = '房态管理';
  query: string = '';
  source: any;
  sourcefilter: any;
  houseState: any;

  //状态按钮组
  stateData = [
    { state: '空净', color: 'btn-info', icon: 'fa-refresh', count: 0 },
    { state: '空脏', color: 'btn-secondary', icon: 'fa-refresh', count: 0 },
    { state: '住人净', color: 'btn-success', icon: 'fa-refresh', count: 0 },
    { state: '住人脏', color: 'btn-danger', icon: 'fa-refresh', count: 0 },
    { state: '维修', color: 'btn-warning', icon: 'fa-refresh', count: 0 },
    { state: '预约', color: 'btn-primary', icon: 'fa-refresh', count: 0 },
    { state: '预离', color: 'btn-dark', icon: 'fa-refresh', count: 0 },
  ];
  //入住标准钮组
  checkInData = [
    { state: '全天房', color: 'btn-info', icon: 'fa-refresh', count: 0 },
    { state: '特殊房', color: 'btn-secondary', icon: 'fa-refresh', count: 0 },
    { state: '钟点房', color: 'btn-success', icon: 'fa-refresh', count: 0 },
    { state: '免费房', color: 'btn-danger', icon: 'fa-refresh', count: 0 },
  ];
  //入住渠道
  channelData = [
    { state: '信用住', color: 'btn-info', icon: 'fa-refresh', count: 0 },
    { state: '去哪儿', color: 'btn-secondary', icon: 'fa-refresh', count: 0 },
    { state: '美团', color: 'btn-success', icon: 'fa-refresh', count: 0 },
    { state: '携程', color: 'btn-danger', icon: 'fa-refresh', count: 0 },
    { state: '艺龙', color: 'btn-warning', icon: 'fa-refresh', count: 0 },
  ];
  //客源
  custData = [
    { state: '散客', color: 'btn-info', icon: 'fa-refresh', count: 0 },
    { state: '会员', color: 'btn-secondary', icon: 'fa-refresh', count: 0 },
    { state: '单位', color: 'btn-success', icon: 'fa-refresh', count: 0 },
    { state: '中介', color: 'btn-danger', icon: 'fa-refresh', count: 0 },
  ];

  constructor(
    private modalService: NgbModal,
    private housestateService: HousestateService,
    private _common: Common,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onSearch(query: string = '') {
    this.source = _.filter(this.sourcefilter, function (o) {
      return o['code'] && o['code'].indexOf(query) > -1
        || o['state'] && o['state'].indexOf(query) > -1
        || o['housetype'] && o['housetype'].indexOf(query) > -1
        || o['tags'] && o['tags'].indexOf(query) > -1;
    });
  }

  getDataList(): void {
    this.housestateService.getHousestates().then((data) => {
      this.source = data;
      this.sourcefilter = data;
      this.houseState = _.countBy(data, 'state');
      const that = this;
      _.each(this.stateData, (e) => {
        if (that.houseState[e.state]) {
          e.count = that.houseState[e.state];
        }
      });
    });
  }
}
