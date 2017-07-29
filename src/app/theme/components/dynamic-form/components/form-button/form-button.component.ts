import { Component, EventEmitter,Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'form-button',
  styleUrls: ['form-button.component.scss'],
  template: `
    <div 
      class="dynamic-field form-button row"
      [formGroup]="group">
      <div class="offset-sm-2 col-sm-10">
      <button class="btn btn-info"
        [disabled]="config.disabled"
        type="submit">
        <i class="fa fa-floppy-o" aria-hidden="true"></i> {{ config.label }}
      </button>
      <button type="button" (click)="onBack($event)" class="btn btn-info"><i class="fa fa-backward" aria-hidden="true"></i> 返回</button>
       </div>
    </div>
  `
})
export class FormButtonComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  @Output() back = new EventEmitter();
  onBack() {
    this.back.emit();
  }
}
