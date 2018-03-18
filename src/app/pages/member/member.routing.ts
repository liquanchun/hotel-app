import { Routes, RouterModule } from '@angular/router';

import { MemberComponent } from './member.component';
import { SettingComponent  } from './setting/setting.component';
import { QueryComponent } from './query/query.component';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      { path: 'setting', component: SettingComponent },
      { path: 'query', component: QueryComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
