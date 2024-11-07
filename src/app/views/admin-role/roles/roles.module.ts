import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { AllRolesComponent } from './All-roles/All-roles.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesRoutingModule } from './roles.routing.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';



@NgModule({
  imports: [
    CommonModule,
    RolesRoutingModule,
    FatoraTemplatesModule,
    SharedModule,
    PrimNgModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RolesComponent,
    AllRolesComponent,
    AddRoleComponent,
    RoleDetailsComponent
  ]
})
export class RolesModule { }
