import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterStep1Component } from './register-account/register-step1/register-step1.component';
import { RegisterStep2Component } from './register-account/register-step2/register-step2.component';
import { RegisterStep3Component } from './register-account/register-step3/register-step3.component';
import { RegisterStep4Component } from './register-account/register-step4/register-step4.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path:'forget-password',component:ForgetPasswordComponent},
    {path:'register-step1',component:RegisterStep1Component},
    {path:'register-step2',component:RegisterStep2Component},
    {path:'register-step3',component:RegisterStep3Component},
    {path:'register-step4',component:RegisterStep4Component}

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class authRoutingModule {}
