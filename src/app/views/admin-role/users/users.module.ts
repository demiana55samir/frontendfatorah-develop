import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users.routing.module';
import { AllUsersComponent } from './All-users/All-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@modules/shared.module';
import { AddUserComponent } from './add-user/add-user.component';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralUserDetailsComponent } from './general-user-details/general-user-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { UserInvoicesComponent } from './user-invoices/user-invoices.component';
import { AllAdministrativeUsersComponent } from './All-administrative-users/All-administrative-users.component';
import { UserInvoiceDetailsComponent } from './user-invoice-details/user-invoice-details.component';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';



@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    TranslateModule,
    SharedModule,
    PrimNgModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    FatoraTemplatesModule
  ],
  declarations: [
    UsersComponent,
    AllUsersComponent,
    AddUserComponent,
    GeneralUserDetailsComponent,
    UserDetailsComponent,
    UserInvoicesComponent,
    AllAdministrativeUsersComponent,
    UserInvoiceDetailsComponent
  ]
})
export class UsersModule { }
