import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgaModule } from '../../theme/nga.module';
import { DynamicFormModule } from '../../theme/components/dynamic-form/dynamic-form.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { TreeModule } from 'angular-tree-component';
import { LoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../components/components.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {ToastyModule} from 'ng2-toasty';

import { Config } from '../../providers/config';
import { GlobalState } from '../../global.state';
import { AppState } from '../../app.service';
import { HttpService } from '../../providers/httpClient';
import { Common } from '../../providers/common';

import { StaffComponent } from './staff.component';
import { routing } from './staff.routing';
import { UserComponent } from './user/user.component';
import { OrgUserComponent } from './org-user/org-user.component';
import { OrgComponent } from './org/org.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    NgaModule,
    DynamicFormModule,
    MultiselectDropdownModule,
    TreeModule,
    ComponentsModule,
    NgbModule,
    LoadingModule,
    Ng2SmartTableModule,
    ToastyModule.forRoot()
  ],
  declarations: [
    StaffComponent,
    UserComponent,
    OrgUserComponent,
    OrgComponent,
  ],
  exports: [OrgComponent],
  providers: [GlobalState, Config, HttpService, AppState,Common]
})
export class StaffModule {}