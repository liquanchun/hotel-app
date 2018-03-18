import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalState } from '../../global.state';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
@Component({
  selector: 'staff',
  template: `<ng2-toasty></ng2-toasty><router-outlet></router-outlet>`,
})
export class StaffComponent implements OnInit {
  private toastOptions: ToastOptions = {
    title: "提示信息",
    msg: "The message",
    showClose: true,
    timeout: 2000,
    theme: "bootstrap",
  };
  constructor(private _state: GlobalState,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
  ) {
    this.toastyConfig.position = 'top-center';
    this._state.subscribe('showMessage.open', (data) => {
      this.toastOptions.msg = data.message;
      if (data.type == "success") {
        this.toastyService.success(this.toastOptions);
      }
      if (data.type == "error") {
        this.toastyService.error(this.toastOptions);
      }
      if (data.type == "warning") {
        this.toastyService.warning(this.toastOptions);
      }
    });
  }

  ngOnInit() {
  }
}