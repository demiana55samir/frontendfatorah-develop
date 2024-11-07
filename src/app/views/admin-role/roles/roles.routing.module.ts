import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllRolesComponent } from './All-roles/All-roles.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';


const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-roles', component: AllRolesComponent ,canActivate:[adminGuard], data: { permissionKey: 'roles.manage' }},
    { path: 'role-data/:type/:uuid', component: AddRoleComponent ,canActivate:[adminGuard], data: { permissionKey: 'roles.manage' }},
    {path:'role-details/:id',component:RoleDetailsComponent,canActivate:[adminGuard], data: { permissionKey: 'roles.manage' }}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
