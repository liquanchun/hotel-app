import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { CardRenderComponent } from '../../components/cardRender/cardRender.component';
import { CardRenderService } from '../../components/cardRender/cardRender.services';
import { MultiselectViewService } from '../../components/multiselectView/multiselectView.services';

import { HouseTypeRenderComponent } from '../../components/houseTypeRender/houseType.component';
import { HouseTypeRenderService } from '../../components/houseTypeRender/houseType.services';

import { DateTimeComponent } from '../../components/dateTimeRender/dateTimeRender.component';
import { DatepickerViewComponent } from '../../components/datepickerView/datepickerView.component';
import { MultiselectViewComponent } from '../../components/multiselectView/multiselectView.component';

import { MemberService } from './member.services';
import { HouseTypeService } from '../house-type//house-type.services';
import { GlobalState } from '../../../global.state';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  providers: [MemberService, CardRenderService, HouseTypeService, HouseTypeRenderService, MultiselectViewService],
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
        filter: false,
        width: '30px',
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
        filter: false,
        width: '30px',
      },
      oldCard: {
        title: '旧卡',
        filter: false,
        type: 'custom',
        renderComponent: CardRenderComponent,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
      },
      newCard: {
        title: '新卡',
        filter: false,
        type: 'custom',
        renderComponent: CardRenderComponent,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
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
        filter: false,
        width: '30px',
      },
      name: {
        title: '名称',
        type: 'string',
        filter: false
      },
      inteType: {
        title: '方式类型',
        type: 'string',
        filter: false,
        editor: {
          type: 'list',
          config: {
            list: [{ value: '天数', title: '天数' }, { value: '金额', title: '金额' }],
          },
        },
      },
      cardType: {
        title: '会员卡类型',
        type: 'custom',
        filter: false,
        renderComponent: CardRenderComponent,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
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
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      endDate: {
        title: '活动结束日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
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
        filter: false,
        width: '30px',
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
        filter: false,
        type: 'custom',
        renderComponent: CardRenderComponent,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
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
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      endDate: {
        title: '活动结束日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
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
        filter: false,
        width: '30px',
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
        filter: false,
        type: 'custom',
        renderComponent: CardRenderComponent,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
      },
      houseType: {
        title: '兑换房型',
        type: 'custom',
        filter: false,
        renderComponent: HouseTypeRenderComponent,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
      },
      useWeeks: {
        title: '有效星期',
        type: 'string',
        filter: false,
        editor: {
          type: 'custom',
          component: MultiselectViewComponent,
        },
      },
      startDate: {
        title: '活动开始日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
      },
      endDate: {
        title: '活动结束日期',
        type: 'custom',
        filter: false,
        renderComponent: DateTimeComponent,
        editor: {
          type: 'custom',
          component: DatepickerViewComponent,
        },
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
    private cardRenderService: CardRenderService,
    private houseTypeService: HouseTypeService,
    private houseTypeRenderService: HouseTypeRenderService,
    private multiselectViewService: MultiselectViewService,
    private _state: GlobalState) {
    this.getDataList();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  getDataList(): void {
    const that = this;
    this.memberService.getMembers('SetCard').then((data) => {
      this.sourceCard.load(data);
      const card = [];
      _.each(data, (d) => {
        card.push({ value: d.id, title: d.name });
        that.cardRenderService.append(d.id, d.name);
      });
      this.settingsCardUpgrade.columns.oldCard.editor.config.list = card;
      this.settingsCardUpgrade.columns.newCard.editor.config.list = card;
      this.settingsIntegral.columns.cardType.editor.config.list = card;
      this.settingsInteExchange.columns.cardType.editor.config.list = card;
      this.settingsInteHouse.columns.cardType.editor.config.list = card;
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
      const myOptions = [
        { id: '星期一', name: '星期一' },
        { id: '星期二', name: '星期二' },
        { id: '星期三', name: '星期三' },
        { id: '星期四', name: '星期四' },
        { id: '星期五', name: '星期五' },
        { id: '星期六', name: '星期六' },
        { id: '星期日', name: '星期日' },
      ];
      _.each(myOptions, (o) => { this.multiselectViewService.append(o.id, o.name); });
      this.sourceInteHouse.load(data);
    });

    this.houseTypeService.getHouseTypes().then((data) => {
      const house = [];
      _.each(data, (d) => {
        house.push({ value: d.id, title: d.typeName });
        that.houseTypeRenderService.append(d.id, d.typeName);
      });
      this.settingsInteHouse.columns.houseType.editor.config.list = house;
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
