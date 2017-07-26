import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { RoleService } from './role.services';

import { RoleModel } from '../../models/role.model';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  providers: [RoleService],
})
export class RoleComponent implements OnInit, AfterViewInit {

  @ViewChild('content') content: ElementRef;

  private isNewRole: boolean;
  private roles: any;
  private message: string;
  private selectedRole: any;
  private newRoleName: string;

  constructor(
    private _state: GlobalState,
    private roleService: RoleService) {
  }

  ngOnInit() {
    this.isNewRole = true;
    this.getRoles();
  }

  ngAfterViewInit() {

  }

  getRoles(): void {
    const that = this;
    this.roleService
      .getRoles()
      .then(function (roles) {
        that.roles = roles;
        that._state.notifyDataChanged('role.dataChanged', roles);
      });
  }

  onSaveRole(event) {
    const that = this;
    this.isNewRole = !this.isNewRole;
    if (this.isNewRole) {
      if (this.newRoleName) {
        // TODO
        this.roleService
          .create(that.newRoleName)
          .then(function (role) {
            that.roles.push(role);
            that.newRoleName = '';
          });
      } else {
        alert('角色名称不能为空。');
      }
    }
  }

  // 删除选择的角色
  onDeleteRole() {
    const that = this;
    that._state.notifyDataChanged('delete.confirm', `${that.selectedRole.role_name}角色`);
    that._state.subscribe('delete.confirm.result', (result) => {
      that.roleService.delete(that.selectedRole.role_id).then(() => {
        _.remove(that.roles, r => r['role_id'] === that.selectedRole.role_id);
        that.selectedRole = null;
      });
    });
  }

  onSelectedRole(role) {
    this.selectedRole = role;
  }
}
