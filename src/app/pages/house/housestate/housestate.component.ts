import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbdModalContent } from '../../../modal-content.component'

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
  providers: [HousestateService, DicService],
})
export class HousestateComponent implements OnInit, AfterViewInit {

  title = '房态管理';
  query: string = '';
  source: any;
  sourcefilter: any;
  houseState: any;

  //状态按钮组
  stateData = [];
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
  custData = [];

  constructor(
    private modalService: NgbModal,
    private housestateService: HousestateService,
    private _dicService: DicService,
    private _common: Common,
    private _state: GlobalState) {
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

  getDataListById(id: number): void {
    this.source = _.filter(this.sourcefilter, (f) => { return f['state'] == id; });
  }

  getDataList(): void {
    this._dicService.getDicByName('客源', (data) => { this.custData = data; });

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
          }else{
            e.count = 0;
          }
        });
      });

    });
  }
}
