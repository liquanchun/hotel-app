import { Routes, RouterModule } from '@angular/router';

import { UserRoleComponent } from './user-role/user-role.component';
import { RoleFunctionComponent } from './role-function/role-function.component';
import { SysComponent } from './sys.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'user-role', component: UserRoleComponent },
      { path: 'role-function', component: RoleFunctionComponent },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
