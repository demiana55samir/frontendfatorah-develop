import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionAndPaymentComponent } from './subscriptionAndPayment/subscriptionAndPayment.component';
import { RenewSubscriptionComponent } from './renew-subscription/renew-subscription.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
  { path: '', redirectTo: 'Subscription', pathMatch: 'full' },
  {path:'subscription-payment',component:SubscriptionAndPaymentComponent},
  {path:'change-plan',component:RenewSubscriptionComponent},
  {path:'make-payment',component:PaymentComponent}

   
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
