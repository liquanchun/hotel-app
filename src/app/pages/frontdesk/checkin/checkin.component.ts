import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { LocalDataSource } from 'ng2-smart-table';

import * as $ from 'jquery';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { HouseinfoService } from '../../house/houseinfo/houseinfo.services';
import { CheckinService } from './checkin.services';
import { ReadIdCardService } from './idcardread.services';
import { HouseTypeService } from '../../sys/house-type/house-type.services';

import { GlobalState } from '../../../global.state';
import { ButtonViewComponent } from './buttonview.component';

@Component({
  selector: 'app-qt-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
  providers: [CheckinService, HouseinfoService, ReadIdCardService,HouseTypeService],
})
export class CheckinComponent implements OnInit, AfterViewInit {
  @Input() showEditButton: boolean = true;
  title = '客人入住';

  private message: string;
  private successMessage: string;
  private _success = new Subject<string>();
  private staticAlertClosed = false;
  private alterType: string;
  private checkIn: any = { cusname: '', cusphone: '', IDCard: '', InType: '', remark: '' };
  private selectedRow: any;

  settingsHouse = {
    actions: {
      columnTitle: '操作'
    },
    hideSubHeader: true,
    noDataMessage: '',
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
      houseType: {
        title: '房型',
        type: 'string',
        filter: false,
        editable: false
      },
      code: {
        title: '房号',
        type: 'number',
        filter: false,
        editable: false
      },
      cardFee: {
        title: '房价',
        type: 'number',
        filter: false,
        editable: false
      },
      days: {
        title: '入住天数',
        type: 'number',
        filter: false
      },
      coupons: {
        title: '早餐券',
        type: 'number',
        filter: false
      },
      cusname: {
        title: '客人姓名',
        type: 'string',
        filter: false
      },
      cusid: {
        title: '客人身份证',
        type: 'string',
        filter: false
      },
      remark: {
        title: '备注',
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
        },
        editable: false
      }
    }
  };

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    mode: 'external',
    selectMode: 'multi',
    hideSubHeader: true,
    columns: {
      code: {
        title: '房号',
        type: 'string',
        filter: false,
        width: '60px',
      },
      houseTypeTxt: {
        title: '房型',
        type: 'string',
        filter: false,
        width: '70px',
      },
      state: {
        title: '房屋状态',
        type: 'string',
        filter: false,
        width: '70px',
      }
    }
  };
  houseType = [
  ];
  //选择房间表格
  selectedGrid: LocalDataSource = new LocalDataSource();
  //弹出框选择
  popGrid: LocalDataSource = new LocalDataSource();
  //选择的房间
  selectedHouse: any = [];

  constructor(
    private _state: GlobalState,
    private _checkinService: CheckinService,
    private _houseinfoService: HouseinfoService,
    private _houseTypeService: HouseTypeService,
    private _readIdCardService: ReadIdCardService,
    fb: FormBuilder) {

    this._state.subscribe('read.idcard', (data) => {
      let newrowdata = _.find(this.selectedHouse, function (o) { return o['code'] == data.code; });
      if (newrowdata) {
        newrowdata['cusname'] = data.name;
        newrowdata['cusid'] = data.idcard;
      }
      this.selectedGrid.refresh();
    });

    this.getDataList();
  }

  ngOnInit() {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
  }

  ngAfterViewInit() {
  }

  onSubmit(values: Object): void {
  }

  readCard() {
    const cust = this._readIdCardService.getIDcard();
    this.checkIn.cusname = cust.name;
    this.checkIn.IDCard = cust.idcard;
  }

  changeSuccessMessage(msg) {
    this._success.next(msg);
  }

  getDataList(): void {
    this._houseinfoService.getHouseinfos().then((data) => {
      this.popGrid.load(data);
    });

    this._houseTypeService.getHouseTypes().then((data) => {
      const that = this;
      _.each(data,function(d){
        that.houseType.push({ type: d.typeName, id:d.id, color: 'btn-info', icon: 'fa-refresh', count: 0 });
      });
    });
  }
  //选择房间
  rowClicked(event): void {
    if (event.isSelected) {
      if (!_.some(this.selectedHouse, ['code', event.data.code])) {
        this.selectedHouse.push(
          {
            houseType: event.data.houseTypeTxt,
            code: event.data.code,
            days: 1,
            coupons: 1,
            cusname: this.checkIn.cusname,
            cusid: this.checkIn.IDCard,
            button: '读取身份证_' + event.data.code
          });
      }
    } else {
      _.remove(this.selectedHouse, function (n) {
        return n['code'] == event.data.code;
      });
    }
    this.selectedGrid.load(this.selectedHouse);
  }
  // 删除
  onDeleteConfirm(event): void {
    if (window.confirm('你确定要删除吗?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  onUserRowSelect(event) {
    this.selectedRow = event.data;
  }
  showPop(event): void {
    _.delay(function (text) {
      $(".popover").css("max-width", "520px");
    }, 100, 'later');
  }
  onSearch(query: string = '') {
    this.popGrid.setFilter([
      { field: 'houseType', search: query },
    ], false);
  }
}
