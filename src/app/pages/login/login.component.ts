import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form:FormGroup;
  public userId:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(private _router: Router,fb:FormBuilder) {
    this.form = fb.group({
      'userId': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.userId = this.form.controls['userId'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
      sessionStorage.setItem("userId", this.userId.value); 
      this._router.navigate( ['/pages/dashboard'] );
    }
  }
}
