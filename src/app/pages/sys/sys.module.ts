
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { SysComponent } from './sys.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { RoleFunctionComponent } from './role-function/role-function.component';
import { routing } from './sys.routing';
import { DynamicFormModule } from '../../theme/components/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    DynamicFormModule,
  ],
  declarations: [
    SysComponent,
    UserRoleComponent,
    RoleFunctionComponent,
  ],
})
export class SysModule { }

