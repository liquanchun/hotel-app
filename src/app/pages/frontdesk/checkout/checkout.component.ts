import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import * as $ from 'jquery';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { CheckoutService } from './checkout.services';
import { GlobalState } from '../../../global.state';

@Component({
  selector: 'app-qt-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [CheckoutService],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @Input() showEditButton: boolean = true;

  title = '退房结算';
  public loading = false;
  private isNewCheckout: boolean;

  private selectedCheckout: any;

  private checkouts: any;
  private checkoutsfilter: any;

  private checkoutForm: FormGroup;
  private checkoutid: AbstractControl;
  private checkoutname: AbstractControl;
  private mobile: AbstractControl;
  private weixin: AbstractControl;
  private email: AbstractControl;
  private pwd: AbstractControl;
  private isvalid: AbstractControl;

  private submitted: boolean = false;
  private editCheckout: any;
  private roles: any;

  private selectVal: any = [];

  constructor(
    private _state: GlobalState,
    private checkoutService: CheckoutService,
    fb: FormBuilder) {

    this.checkoutForm = fb.group({
      'checkoutid': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'checkoutname': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      'pwd': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'weixin': [''],
      'email': [''],
      'isvalid': [''],
      'roleids': [''],
    });

    this.checkoutid = this.checkoutForm.controls['checkoutid'];
    this.checkoutname = this.checkoutForm.controls['checkoutname'];
    this.mobile = this.checkoutForm.controls['mobile'];
    this.weixin = this.checkoutForm.controls['weixin'];
    this.email = this.checkoutForm.controls['email'];
    this.pwd = this.checkoutForm.controls['pwd'];
    this.isvalid = this.checkoutForm.controls['isvalid'];
  }

  ngOnInit() {
    this.getCheckoutList();
  }

  getCheckoutList() {
    const that = this;
    this.checkoutService.getCheckouts().then(function (checkouts) {
      that.checkouts = checkouts;
    }, (err) => {
    });
  }

  ngAfterViewInit() {
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    const that = this;
    if (this.checkoutForm.valid) {
      // your code goes here
      console.log(values);
      values['roleids'] = this.selectVal.toString();
      values['isvalid'] = values['isvalid'] ? values['isvalid'] : 0;
      values['pwd'] = Md5.hashStr(values['pwd']).toString();
      this.checkoutService.create(values).then(function (checkout) {
        that.checkouts.push(checkout);
      }, (err) => {
      });
    }
  }

  onCheck(id, event) {
    if (_.indexOf(this.selectVal, id) > -1) {
      _.remove(this.selectVal, function (n) {
        return n === id;
      });
    } else {
      this.selectVal.push(id);
    }
  }

  onKey(event: any) { // without type info
    this.checkouts = _.filter(this.checkoutsfilter, function (o) {
      return o['checkoutName'] && o['checkoutName'].indexOf(event.target.value) > -1
        || o['checkoutId'] && o['checkoutId'].indexOf(event.target.value) > -1
        || o['mobile'] && o['mobile'].indexOf(event.target.value) > -1
        || o['weixin'] && o['weixin'].indexOf(event.target.value) > -1;
    });
  }
}
