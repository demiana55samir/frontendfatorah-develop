import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllQuotationsComponent } from './all-quotations/all-quotations.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-quotations', component: AllQuotationsComponent ,canActivate:[adminGuard] ,  data: { permissionKey: 'quotations.manage' }},
    { path: 'quotation-datails/:uuid', component:QuotationDetailsComponent  ,canActivate:[adminGuard] ,  data: { permissionKey: 'quotations.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationssRoutingModule {}
