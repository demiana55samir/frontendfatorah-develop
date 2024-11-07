import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authRoutingModule } from './auth.routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterStep1Component } from './register-account/register-step1/register-step1.component';
import { RegisterStep2Component } from './register-account/register-step2/register-step2.component';
import { RegisterStep3Component } from './register-account/register-step3/register-step3.component';
import { RegisterStep4Component } from './register-account/register-step4/register-step4.component';
import { SharedModule } from '@modules/shared.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';







@NgModule({
  imports: [
    CommonModule,
    authRoutingModule,
    SharedModule,
    PrimNgModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    TranslateModule
  ],
  declarations: [
    AuthComponent,
    ForgetPasswordComponent,
    LoginComponent,
    RegisterStep1Component,
    RegisterStep2Component,
    RegisterStep3Component,
    RegisterStep4Component,
  ]
})
export class AuthModule { }
