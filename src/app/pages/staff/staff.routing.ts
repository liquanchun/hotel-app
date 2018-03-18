import { Routes, RouterModule } from '@angular/router';

import { StaffComponent } from './staff.component';
import { UserComponent } from './user/user.component';
import { OrgUserComponent } from './org-user/org-user.component';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent,
    children: [
      { path: 'user', component: UserComponent },
      { path: 'org-user', component: OrgUserComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
