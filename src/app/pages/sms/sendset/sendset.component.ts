import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import {NgbdModalContent} from '../../../modal-content.component'
  
import { SendsetService } from './sendset.services';
import { GlobalState } from '../../../global.state';
import { Common } from '../../../providers/common';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-sendset',
  templateUrl: './sendset.component.html',
  styleUrls: ['./sendset.component.scss'],
  providers: [SendsetService],
})
export class SendsetComponent implements OnInit, AfterViewInit {

  title = '短信设置';
  totalRecord = 89;
  page = 1;
  query: string = '';

  constructor(
    private modalService: NgbModal,
    private sendsetService: SendsetService,
    private _common: Common,
    private _state: GlobalState) {
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
}
