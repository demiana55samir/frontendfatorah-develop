import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllPaymentLinksComponent } from './all-payment-links/all-payment-links.component';
import { PaymentLinkDetailsComponent } from './payment-link-details/payment-link-details.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-payment-links',
     component: AllPaymentLinksComponent ,
     canActivate:[adminGuard],
     data: { permissionKey: 'payment_links.manage' }
    },
    { path: 'payment-link-details/:uuid',
     component: PaymentLinkDetailsComponent ,
     canActivate:[adminGuard],
     data: { permissionKey: 'payment_links.manage' }
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPaymentLinksRoutingModule {}
