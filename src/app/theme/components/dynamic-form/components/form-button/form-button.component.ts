import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GlobalState } from '../../../../../global.state';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'form-button',
  styleUrls: ['form-button.component.scss'],
  template: `
    <div 
      class="dynamic-field form-button row"
      [formGroup]="group">
      <div class="offset-md-3 col-md-9">
      <button *ngIf="!config.hide" class="btn btn-info"
        [disabled]="config.disabled"
        type="submit">
        <i class="fa fa-floppy-o" aria-hidden="true"></i> {{ config.label }}
      </button>
      <button *ngIf="config.callback" type="button" (click)="call(config.callback)" 
      class="btn btn-info"><i class="fa fa-backward" aria-hidden="true"></i> 返回</button>
       </div>
    </div>
  `
})
export class FormButtonComponent implements Field {
  @Output()
  callback: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _state: GlobalState) {
  }

  config: FieldConfig;
  group: FormGroup;

  call(func): void {
    this._state.notifyDataChanged('backup-click', new Date().getTime());
    //this.callback.emit(event);
    func('my call');
  }
}
