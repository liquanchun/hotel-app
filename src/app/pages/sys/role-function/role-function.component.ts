
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldConfig } from '../../../theme/components/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from '../../../theme/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
@Component({
  selector: 'app-role-function',
  templateUrl: './role-function.component.html',
  styleUrls: ['./role-function.component.scss']
})
export class RoleFunctionComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Full name',
      name: 'name',
      placeholder: 'Enter your name',
      validation: [Validators.required, Validators.minLength(4)]
    },
    {
      type: 'select',
      label: 'Favourite Food',
      name: 'food',
      options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
      placeholder: 'Select an option',
      validation: [Validators.required]
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });

    this.form.setDisabled('submit', true);
    this.form.setValue('name', 'Todd Motto');
  }

  submit(value: {[name: string]: any}) {
    console.log(value);
  }

}
