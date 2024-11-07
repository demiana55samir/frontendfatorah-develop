import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MainUserDetailsComponent } from './main-user-details/main-user-details.component';
import { CancelledUsersComponent } from './cancelled-users/cancelled-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';

const routes: Routes = [
  { path: '', redirectTo: 'All-invoices', pathMatch: 'full' },
    { path: 'add-user', component: AddNewUserComponent },
    { path: 'users-list', component: UsersListComponent },
    {path:'user-details/:uuid',component:MainUserDetailsComponent},
    {path:'cancelled-users',component:CancelledUsersComponent},
    {path:'edit-user/:uuid',component:EditUserComponent},
    {path:'user-profile',component:UserProfileComponent},
    {path:'suppliers-list',component:SuppliersListComponent},
   {path:'suppliers-details/:uuid',component:SupplierDetailsComponent},

   { path: 'Add-supplier/:type/:uuid', component: AddEditSupplierComponent },

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class userRoutingModule {}
