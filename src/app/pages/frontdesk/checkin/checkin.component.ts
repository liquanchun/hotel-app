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
import { GlobalState } from '../../../global.state';

@Component({
  selector: 'app-qt-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
  providers: [CheckinService, HouseinfoService],
})
export class CheckinComponent implements OnInit, AfterViewInit {
  @Input() showEditButton: boolean = true;
  title = '客人入住';
  public loading = false;
  private isNewCheckin: boolean;

  private message: string;
  private selectedCheckin: any;

  private checkins: any;
  private checkinsfilter: any;

  private checkinForm: FormGroup;
  private checkinid: AbstractControl;
  private checkinname: AbstractControl;
  private mobile: AbstractControl;
  private weixin: AbstractControl;
  private email: AbstractControl;
  private pwd: AbstractControl;
  private isvalid: AbstractControl;

  private submitted: boolean = false;
  private editCheckin: any;
  private roles: any;

  private selectVal: any = [];

  private successMessage: string;
  private _success = new Subject<string>();
  private staticAlertClosed = false;
  private alterType: string;

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
      name: {
        title: '房型',
        type: 'string',
        filter: false
      },
      level: {
        title: '房号',
        type: 'number',
        filter: false
      },
      cardFee: {
        title: '房价',
        type: 'number',
        filter: false
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
      }
    }
  };

  settings = {
    actions:{
      add:false,
      edit:false,
      delete:false
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
      houseType: {
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

  sourceHouse: LocalDataSource = new LocalDataSource();
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private _state: GlobalState,
    private checkinService: CheckinService,
    private houseinfoService: HouseinfoService,
    fb: FormBuilder) {

    this.checkinForm = fb.group({
      'checkinid': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'checkinname': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      'pwd': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'weixin': [''],
      'email': [''],
      'isvalid': [''],
      'roleids': [''],
    });

    this.checkinid = this.checkinForm.controls['checkinid'];
    this.checkinname = this.checkinForm.controls['checkinname'];
    this.mobile = this.checkinForm.controls['mobile'];
    this.weixin = this.checkinForm.controls['weixin'];
    this.email = this.checkinForm.controls['email'];
    this.pwd = this.checkinForm.controls['pwd'];
    this.isvalid = this.checkinForm.controls['isvalid'];

    this.getDataList();
  }

  ngOnInit() {
    this.getCheckinList();
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
  }

  getCheckinList() {
    const that = this;
    this.checkinService.getCheckins().then(function (checkins) {
      that.checkins = checkins;
    }, (err) => {
      that.alterType = 'danger';
      that.changeSuccessMessage(err);
    });
  }

  ngAfterViewInit() {
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    const that = this;
    if (this.checkinForm.valid) {
      // your code goes here
      console.log(values);
      values['roleids'] = this.selectVal.toString();
      values['isvalid'] = values['isvalid'] ? values['isvalid'] : 0;
      values['pwd'] = Md5.hashStr(values['pwd']).toString();
      this.checkinService.create(values).then(function (checkin) {
        that.alterType = 'success';
        that.changeSuccessMessage('保存成功。');
        that.checkins.push(checkin);
      }, (err) => {
        that.alterType = 'danger';
        that.changeSuccessMessage(`保存失败。${err}`);
      });
    }
  }

  changeSuccessMessage(msg) {
    this._success.next(msg);
  }

  getDataList(): void {
    this.houseinfoService.getHouseinfos().then((data) => {
      this.source.load(data);
    });
  }

  showPop(event):void{
    console.log('show pop');
    console.log($(".popover"));
    $("#ngb-popover-0").css("max-width","320px");
  }
}
