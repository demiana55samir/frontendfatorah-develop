import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPaymentLinksComponent } from './All-payment-links/All-payment-links.component';
import { PaymentLinkDetailsComponent } from './payment-link-details/payment-link-details.component';
import { BalanceTransferRequestsComponent } from './balance-transfer-requests/balance-transfer-requests.component';

const routes: Routes = [
  { path: '', redirectTo: 'All-payment-links', pathMatch: 'full' },
    { path: 'All-payment-links', component: AllPaymentLinksComponent },
    { path: 'payment-link-details/:uuid', component: PaymentLinkDetailsComponent },
    {path:'balance-transfer-request',component:BalanceTransferRequestsComponent}
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentLinksRoutingModule {}
