import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgaModule } from '../../theme/nga.module';
import { DynamicFormModule } from '../../theme/components/dynamic-form/dynamic-form.module';

import { Config } from '../../providers/config';
import { GlobalState } from '../../global.state';
import { AppState } from '../../app.service';
import { HttpService } from '../../providers/httpClient';
import { Common } from '../../providers/common';
import { DicService } from '../sys/dic/dic.services';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import {ToastyModule} from 'ng2-toasty';
import { TreeModule } from 'angular-tree-component';
import { LoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../components/components.module';

import { routing } from './market.routing';
import { MarketComponent } from './market.component';

import { CustomerComponent } from './customer/customer.component';
import { ServiceItemComponent } from './serviceitem/serviceitem.component';
import { SelectServiceComponent  } from './selectservice/selectservice.component';
import { HouseTypeComponent } from './house-type/house-type.component';
import { HouseFeeComponent } from './house-fee/house-fee.component';
import { SetGroupComponent } from './set-group/set-group.component';
import { SetAgentComponent } from './set-agent/set-agent.component';

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
    ComponentsModule,
    NgbModule,
    LoadingModule,
    Ng2SmartTableModule,
    ToastyModule.forRoot()
  ],
  declarations: [
    MarketComponent,
    CustomerComponent,
    ServiceItemComponent,
    SelectServiceComponent,
    HouseTypeComponent,
    HouseFeeComponent,
    SetGroupComponent,
    SetAgentComponent,
  ],
  exports: [SelectServiceComponent],
  providers: [GlobalState, Config, HttpService, AppState,Common,DicService]
})
export class MarketModule {}