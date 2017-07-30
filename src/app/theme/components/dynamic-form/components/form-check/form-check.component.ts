import { Component, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'form-check',
  styleUrls: ['form-check.component.scss'],
  template: ` 
    <div class="dynamic-field form-group row" [formGroup]="group" >
      <div class="col-md-2"><label>{{config.label}}</label></div>
      <div class="col-md-10">
        <div *ngFor="let option of config.options" class="form-check form-check-inline">
          <label class="form-check-label">
            <input [name]="config.name"  [formControlName]="config.name" class="form-check-input" (click)="onCheck(option.id,$event)" [type]="config.check" [id]="option.id" [value]="option.id"> {{ option.name }}
          </label>
        </div>
        <input type="hidden" [value]="selectVal" (input)="selectVal=$event.target.value" >
      </div>
    </div>
  `,
})
export class FormCheckComponent implements Field, OnInit, AfterViewInit {
  config: FieldConfig;
  group: FormGroup;

  selectVal: string = '';
  ngOnInit() {
  }

  ngAfterViewInit() {
    const that = this;

    this.group.controls[this.config.name].valueChanges
      .subscribe(data => {
        that.selectVal = data;
        const selectValArray = data.split(',');
        $('.form-check-input').each(function (i, e) {
          if (_.indexOf(selectValArray, $(this).attr('id')) > -1) {
            $(this).attr('checked', 'checked');
          }
        });
      });
  }

  onCheck(id, event) {
    if (this.config.check === 'checkbox') {
      if (this.selectVal.indexOf(id) > -1) {
        this.selectVal = this.selectVal.replace(`${id}`, '');
      } else {
        this.selectVal = `${this.selectVal},${id}`;
      }
    } else {
      this.selectVal = id;
    }
    this.group.controls[this.config.name].setValue(this.selectVal, { emitEvent: true });
  }
}
