import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../pages/sys/components/user/user.services';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [UserService],
})
export class Login {

  public form: FormGroup;
  public loginUserId: AbstractControl;
  public loginPassword: AbstractControl;
  public submitted: boolean = false;

  private toastOptions: ToastOptions = {
    title: "提示信息",
    msg: "The message",
    showClose: true,
    timeout: 2000,
    theme: "bootstrap",
  };

  constructor(private _router: Router,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private _userService: UserService,
    fb: FormBuilder) {
    this.toastyConfig.position = 'top-center';
    this.form = fb.group({
      'loginUserId': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'loginPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.loginUserId = this.form.controls['loginUserId'];
    this.loginPassword = this.form.controls['loginPassword'];
  }

  public onSubmit(values: Object): void {
    console.log(Md5.hashStr(this.loginPassword.value).toString());
    this.submitted = true;
    if (this.form.valid) {

      this._userService.getUsersById(this.loginUserId.value).then((data) => {
        if (!data) {
          this.toastOptions.msg = '用户不存在。';
          this.toastyService.error(this.toastOptions);
        } else {
          const mima = data['pwd'];
          const pd = Md5.hashStr(this.loginPassword.value).toString();
          if (mima == pd) {
            sessionStorage.setItem('pwd', pd);
            sessionStorage.setItem('userName', data['userName']);
            sessionStorage.setItem('userId', this.loginUserId.value);
            this._router.navigate(['/pages/dashboard']);
          } else {
            this.toastOptions.msg = '密码错误。';
            this.toastyService.error(this.toastOptions);
          }
        }
      },
        (err) => {
          this.toastOptions.msg = err;
          this.toastyService.error(this.toastOptions);
        });
    }
  }
}
