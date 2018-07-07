import { Routes, RouterModule } from '@angular/router';

import { UserRoleComponent } from './user-role/user-role.component';
import { RoleMenuComponent } from './role-menu/role-menu.component';
import { DicComponent } from './dic/dic.component';

import { SysComponent } from './sys.component';

import { SetPaytypeComponent } from './set-paytype/set-paytype.component';
import { UserInfoComponent } from './userinfo/userinfo.component';
import { SetPhotoComponent } from './setphoto/setphoto.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'user-role', component: UserRoleComponent },
      { path: 'role-menu', component: RoleMenuComponent },
      { path: 'dic', component: DicComponent },
      { path: 'set-paytype', component: SetPaytypeComponent },
      { path: 'userinfo', component: UserInfoComponent },
      { path: 'setphoto', component: SetPhotoComponent },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
