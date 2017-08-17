import { Routes, RouterModule } from '@angular/router';

import { UserRoleComponent } from './user-role/user-role.component';
import { RoleMenuComponent } from './role-menu/role-menu.component';
import { OrgUserComponent } from './org-user/org-user.component';
import { DicComponent } from './dic/dic.component';

import { SysComponent } from './sys.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'user-role', component: UserRoleComponent },
      { path: 'role-menu', component: RoleMenuComponent },
      { path: 'org-user', component: OrgUserComponent },
      { path: 'dic', component: DicComponent },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
