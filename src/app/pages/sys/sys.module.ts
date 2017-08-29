
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgaModule } from '../../theme/nga.module';
import { DashboardModule } from '../../pages/dashboard/dashboard.module';

import { SysComponent } from './sys.component';
import { routing } from './sys.routing';
import { DynamicFormModule } from '../../theme/components/dynamic-form/dynamic-form.module';

import { UserRoleComponent } from './user-role/user-role.component';
import { RoleMenuComponent } from './role-menu/role-menu.component';
import { OrgUserComponent } from './org-user/org-user.component';
import { DicComponent } from './dic/dic.component';
import { HouseTypeComponent } from './house-type/house-type.component';
import { HouseFeeComponent } from './house-fee/house-fee.component';
import { MemberComponent } from './member/member.component';

import { FunctionComponent } from './components/function/function.component';
import { MenuComponent } from './components/menu/menu.component';
import { OrgComponent } from './components/org/org.component';
import { RoleComponent } from './components/role/role.component';
import { UserComponent } from './components/user/user.component';
import { SelectUserComponent } from './components/selectuser/selectuser.component';

import { Config } from '../../providers/config';

import { GlobalState } from '../../global.state';
import { AppState } from '../../app.service';

import { HttpService } from '../../providers/httpClient';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { TreeModule } from 'angular-tree-component';

import { LoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    DynamicFormModule,
    MultiselectDropdownModule,
    TreeModule,
    NgbModule,
    LoadingModule,
    DashboardModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    SysComponent,
    UserRoleComponent,
    RoleMenuComponent,
    FunctionComponent,
    MenuComponent,
    OrgComponent,
    RoleComponent,
    UserComponent,
    DicComponent,
    OrgUserComponent,
    SelectUserComponent,
    HouseTypeComponent,
    HouseFeeComponent,
    MemberComponent,
  ],
  providers: [GlobalState, Config, HttpService, AppState]
})
export class SysModule { }

