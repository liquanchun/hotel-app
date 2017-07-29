import { Component, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import * as $ from 'jquery';

@Component({
  selector: 'form-select',
  styleUrls: ['form-select.component.scss'],
  template: `
    <div 
      class="dynamic-field form-select row"
      [formGroup]="group">
      <label  for="config.name" class="col-sm-2 col-form-label">{{ config.label }}</label>
      <div class="col-sm-10">
      <select [formControlName]="config.name">
        <option value="">{{ config.placeholder }}</option>
        <option *ngFor="let option of config.options">
          {{ option }}
        </option>
      </select>
      </div>  
    </div>
  `
})
export class FormSelectComponent implements Field, AfterViewInit {
  config: FieldConfig;
  group: FormGroup;

    ngAfterViewInit() {
        //$('.ui.dropdown').dropdown();
    }
}
