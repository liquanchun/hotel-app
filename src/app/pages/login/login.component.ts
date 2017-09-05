import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form: FormGroup;
  public loginUserId: AbstractControl;
  public loginPassword: AbstractControl;
  public submitted: boolean = false;

  constructor(private _router: Router, fb: FormBuilder) {
    this.form = fb.group({
      'loginUserId': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'loginPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.loginUserId = this.form.controls['loginUserId'];
    this.loginPassword = this.form.controls['loginPassword'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
      sessionStorage.setItem('userId', this.loginUserId.value);
      this._router.navigate(['/pages/dashboard']);
    }
  }
}
