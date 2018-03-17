import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgaModule } from '../../theme/nga.module';
import { DynamicFormModule } from '../../theme/components/dynamic-form/dynamic-form.module';
import { MarketModule } from '../market/market.module';

import { Config } from '../../providers/config';
import { GlobalState } from '../../global.state';
import { AppState } from '../../app.service';
import { HttpService } from '../../providers/httpClient';
import { Common } from '../../providers/common';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { TreeModule } from 'angular-tree-component';
import { LoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../components/components.module';

import { routing } from './frontdesk.routing';
import { FrontdeskComponent } from './frontdesk.component';
import { ChangworkComponent } from './changwork/changwork.component';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CouponComponent } from './coupon/coupon.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ButtonViewComponent } from './checkin/buttonview.component';
import { ServiceListComponent  } from './servicelist/servicelist.component';
import {ToastyModule} from 'ng2-toasty';
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
    MarketModule,
    ToastyModule.forRoot()
  ],
  declarations: [
    FrontdeskComponent,
    ChangworkComponent,
    CheckinComponent,
    CheckoutComponent,
    CouponComponent,
    ScheduleComponent,
    ButtonViewComponent,
    ServiceListComponent
  ],
  entryComponents: [ButtonViewComponent],
  providers: [GlobalState, Config, HttpService, AppState,Common]
})
export class FrontdeskModule {}