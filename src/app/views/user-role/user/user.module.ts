import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MainUserDetailsComponent } from './main-user-details/main-user-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserInvoicesComponent } from './user-invoices/user-invoices.component';
import { CancelledUsersComponent } from './cancelled-users/cancelled-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserReceiptVoucherComponent } from './user-receipt-voucher/user-receipt-voucher.component';
import { UserPriceOffersComponent } from './user-price-offers/user-price-offers.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { userRoutingModule } from './user.routing.module';
import { LayoutModule } from 'app/views/layout/layout.module';
import {TabMenuModule} from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';



@NgModule({
  imports: [
    CommonModule,
    userRoutingModule,
    LayoutModule,
    TabMenuModule,
    TableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PrimNgModule,
    NgApexchartsModule,
    
  ],
  declarations: [
    UserComponent,
    AddNewUserComponent,
    UsersListComponent,
    MainUserDetailsComponent,
    UserDetailsComponent,
    UserInvoicesComponent,
    CancelledUsersComponent,
    EditUserComponent,
    UserReceiptVoucherComponent,
    UserPriceOffersComponent,
    UserProfileComponent,
    SuppliersListComponent,
    SupplierDetailsComponent,
    AddEditSupplierComponent
  ]
})
export class UserModule { }
