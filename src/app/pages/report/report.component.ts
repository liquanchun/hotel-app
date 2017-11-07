import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalState } from '../../global.state';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'report',
  template: `<router-outlet></router-outlet>`,
})
export class ReportComponent implements OnInit {
  @ViewChild('content') content: ElementRef;

  private message: string;
  constructor(private _state: GlobalState, private modalService: NgbModal) {
    const that = this;
    //删除提示对话框
    this._state.subscribe('delete.confirm', (confirm) => {
      this.message = `你确定要删除${confirm.message}吗？`;
      this.modalService
        .open(this.content, { backdrop: 'static', size: 'sm', keyboard: false })
        .result
        .then((result) => {
          if (result === 'yes') {
            //that._state.notifyDataChanged('delete.confirm.result', 'yes');
            confirm.callback();
          }
        }, (reason) => { });
    });
  }

  ngOnInit() {
  }
}