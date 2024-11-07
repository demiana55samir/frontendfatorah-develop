import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersComponent } from './All-users/All-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { GeneralUserDetailsComponent } from './general-user-details/general-user-details.component';
import { AllAdministrativeUsersComponent } from './All-administrative-users/All-administrative-users.component';
import { UserInvoiceDetailsComponent } from './user-invoice-details/user-invoice-details.component';
import { adminGuard } from 'app/core/guards/admin.guard';
import { AdminSupportGuard } from 'app/core/guards/admin_support.guard';


const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-users', component: AllUsersComponent ,canActivate:[adminGuard], data: { permissionKey: 'users.view' }},
    { path: 'user-data/:type/:uuid', component: AddUserComponent ,canActivate:[adminGuard], data: { permissionKey: 'users.manage' } },
    { path: 'Administrative-user-details/:uuid', component: GeneralUserDetailsComponent,canActivate:[adminGuard], data: { permissionKey: 'all.manage' } },
    { path: 'user-details/:uuid', component: GeneralUserDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'users.manage' }},
    {path:'All-administrative-users',component:AllAdministrativeUsersComponent ,canActivate:[adminGuard], data: { permissionKey: 'all.manage' }},
    {path:'invoice-details/:uuid',component:UserInvoiceDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'invoices.manage' }}

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
