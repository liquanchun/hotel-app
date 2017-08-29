import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { MemberService } from './member.services';
import { GlobalState } from '../../../global.state';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  providers: [MemberService],
})
export class MemberComponent implements OnInit, AfterViewInit {

  query: string = '';

  settingsCard = {
    actions: {
      columnTitle: '操作'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
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
        filter: false
      },
      name: {
        title: '会员卡',
        type: 'string',
        filter: false
      },
      level: {
        title: '级别',
        type: 'number',
        filter: false
      },
      cardFee: {
        title: '卡费',
        type: 'number',
        filter: false
      },
      isRecharge: {
        title: '是否可充值',
        type: 'number',
        filter: false,
        editor: {
          type: 'checkbox',
          config: {
            true: '是',
            false: '否',
          },
        },
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };


  settingsCardUpgrade = {
    actions: {
      columnTitle: '操作'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
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
        filter: false
      },
      oldCard: {
        title: '旧卡',
        type: 'string',
        filter: false
      },
      newCard: {
        title: '新卡',
        type: 'string',
        filter: false
      },
      needInte: {
        title: '升级所需积分',
        type: 'number',
        filter: false
      },
      takeInte: {
        title: '升级消耗积分',
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


  settingsIntegral = {
    actions: {
      columnTitle: '操作'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
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
        filter: false
      },
      name: {
        title: '名称',
        type: 'string',
        filter: false
      },
      inteType: {
        title: '方式类型',
        type: 'string',
        filter: false
      },
      cardType: {
        title: '会员卡类型',
        type: 'string',
        filter: false
      },
      dayOrFee: {
        title: '天数/金额',
        type: 'number',
        filter: false
      },
      integral: {
        title: '积分',
        type: 'number',
        filter: false
      },
      startDate: {
        title: '活动开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '活动结束日期',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };


  settingsInteExchange = {
    actions: {
      columnTitle: '操作'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
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
        filter: false
      },
      name: {
        title: '名称',
        type: 'string',
        filter: false
      },
      exchangeType: {
        title: '兑换类型',
        type: 'string',
        filter: false
      },
      cardType: {
        title: '会员卡类型',
        type: 'string',
        filter: false
      },
      giftName: {
        title: '礼品名称',
        type: 'string',
        filter: false
      },
      exchangeInte: {
        title: '所需积分',
        type: 'number',
        filter: false
      },
      startDate: {
        title: '活动开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '活动结束日期',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };


  settingsInteHouse = {
    actions: {
      columnTitle: '操作'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
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
        filter: false
      },
      name: {
        title: '名称',
        type: 'string',
        filter: false
      },
      takeInte: {
        title: '所需积分',
        type: 'number',
        filter: false
      },
      cardType: {
        title: '会员卡类型',
        type: 'string',
        filter: false
      },
      houseType: {
        title: '兑换房型',
        type: 'string',
        filter: false
      },
      useWeeks: {
        title: '有效星期',
        type: 'string',
        filter: false
      },
      startDate: {
        title: '活动开始日期',
        type: 'string',
        filter: false
      },
      endDate: {
        title: '活动结束日期',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
        type: 'string',
        filter: false
      }
    }
  };
  sourceCard: LocalDataSource = new LocalDataSource();
  sourceCardUpgrade: LocalDataSource = new LocalDataSource();
  sourceIntegral: LocalDataSource = new LocalDataSource();
  sourceInteExchange: LocalDataSource = new LocalDataSource();
  sourceInteHouse: LocalDataSource = new LocalDataSource();

  constructor(
    private memberService: MemberService,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  getDataList(): void {
    this.memberService.getMembers('SetCard').then((data) => {
      this.sourceCard.load(data);
    });
    this.memberService.getMembers('SetCardUpgrade').then((data) => {
      this.sourceCardUpgrade.load(data);
    });
    this.memberService.getMembers('SetIntegral').then((data) => {
      this.sourceIntegral.load(data);
    });
    this.memberService.getMembers('SetInteExchange').then((data) => {
      this.sourceInteExchange.load(data);
    });
    this.memberService.getMembers('SetInteHouse').then((data) => {
      this.sourceInteHouse.load(data);
    });
  }
  // 新增
  onCreateConfirm(modelName, event): void {
    if (event.newData) {
      this.memberService.create(modelName, event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 修改
  onSaveConfirm(modelName, event): void {
    if (event.newData && event.newData.id) {
      this.memberService.update(modelName, event.newData.id, event.newData).then((data) => {
        event.confirm.resolve(event.newData);
        this.getDataList();
      });
    } else {
      event.confirm.reject();
    }
  }
  // 删除
  onDeleteConfirm(modelName, event): void {
    if (window.confirm('你确定要删除吗?')) {
      this.memberService.delete(modelName, event.data.id).then((data) => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

}
