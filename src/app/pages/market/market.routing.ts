import { Routes, RouterModule } from '@angular/router';

import { MarketComponent } from './market.component';
import { CustomerComponent } from './customer/customer.component';
import { ServiceItemComponent } from './serviceitem/serviceitem.component';
import { HouseTypeComponent } from './house-type/house-type.component';
import { HouseFeeComponent } from './house-fee/house-fee.component';
import { SetGroupComponent } from './set-group/set-group.component';
import { SetAgentComponent } from './set-agent/set-agent.component';
const routes: Routes = [
  {
    path: '',
    component: MarketComponent,
    children: [
      { path: 'customer', component: CustomerComponent },
      { path: 'serviceitem', component: ServiceItemComponent },
      { path: 'house-type', component: HouseTypeComponent },
      { path: 'house-fee', component: HouseFeeComponent },
      { path: 'set-group', component: SetGroupComponent },
      { path: 'set-agent', component: SetAgentComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
