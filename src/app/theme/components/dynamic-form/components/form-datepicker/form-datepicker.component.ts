import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'form-datepicker',
  styleUrls: ['form-datepicker.component.scss'],
  template: `
    <div 
      class="dynamic-field form-input row" 
      [formGroup]="group">
      <label for="config.name" class="col-sm-2 col-form-label">{{ config.label }}</label>
      <div class="form-group col-sm-10">
        <div class="input-group">
          <input class="form-control" placeholder="yyyy-mm-dd"
                [formControlName]="config.name" ngbDatepicker #d="ngbDatepicker">
          <div class="input-group-addon" (click)="d.toggle()" >
            <i class="fa fa-calendar" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FormDatepickerComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  model;
}
