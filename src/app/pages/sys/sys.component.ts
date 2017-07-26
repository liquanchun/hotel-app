import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalState } from '../../global.state';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'sys',
  templateUrl: './sys.html',
})
export class SysComponent implements OnInit {
  @ViewChild('content') content: ElementRef;

  private message: string;
  constructor(private _state: GlobalState, private modalService: NgbModal) {
    const that = this;
    //删除提示对话框
    this._state.subscribe('delete.confirm', (message) => {
      this.message = `你确定要删除${message}吗？`;
      this.modalService
        .open(this.content, { backdrop: 'static', size: 'sm', keyboard: false })
        .result
        .then((result) => {
          if (result === 'yes') {
            that._state.notifyDataChanged('delete.confirm.result', 'yes');
          }
        }, (reason) => { });
    });
  }

  ngOnInit() {
  }
}
