import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { BaThemeConfigProvider } from '../../../theme';
import { OrgComponent } from '../org/org.component';
import { UserComponent } from '../user/user.component';
import { OrgService } from '../org/org.services';
import { GlobalState } from '../../../global.state';
@Component({
  selector: 'app-org-user',
  templateUrl: './org-user.component.html',
  styleUrls: ['./org-user.component.scss'],
  providers: [OrgService],
})
export class OrgUserComponent implements OnInit, AfterViewInit {
  private orgId: number;

  constructor(private orgService: OrgService,
    private _state: GlobalState,
  ) {
    const that = this;
    this._state.subscribe('org.selectedChanged', (org) => {
      if (org && org.data) {
        that.orgId = org.data.id;
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }
  onMessage(event) {
    const msg = event.msg;
    if (event.type == 'warning') {
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "warning", time: new Date().getTime() });
    }
    if (event.type == 'success') {
      this._state.notifyDataChanged("showMessage.open", { message: msg, type: "success", time: new Date().getTime() });
    }
    if (event.type == 'error') {
      
    }
  }
  selectedUser(user) {
    // if (user.isChecked) {
    //   this.orgService.createOrg(this.orgId, user.id);
    // } else {
    //   this.orgService.deleteOrg(this.orgId, user.id);
    // }
  }
}
