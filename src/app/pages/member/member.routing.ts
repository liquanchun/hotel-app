import { Routes, RouterModule } from '@angular/router';

import { MemberComponent } from './member.component';
import { SettingComponent  } from './setting/setting.component';
import { QueryComponent } from './query/query.component';
import { DiscountComponent } from './discount/discount.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { IntegralComponent } from './integral/integral.component';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      { path: 'setting', component: SettingComponent },
      { path: 'query', component: QueryComponent },
      { path: 'discount', component: DiscountComponent },
      { path: 'exchange', component: ExchangeComponent },
      { path: 'integral', component: IntegralComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
