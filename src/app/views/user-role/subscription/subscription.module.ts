import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { SubscriptionAndPaymentComponent } from './subscriptionAndPayment/subscriptionAndPayment.component';
import { RenewSubscriptionComponent } from './renew-subscription/renew-subscription.component';
import { PaymentComponent } from './payment/payment.component';
import { SubscriptionRoutingModule } from './subscription.routing.module';
import { LayoutModule } from 'app/views/layout/layout.module';
import { SharedModule } from '@modules/shared.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    LayoutModule,
    SharedModule,
    PrimNgModule,
    FatoraTemplatesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SubscriptionComponent,
    SubscriptionAndPaymentComponent,
    RenewSubscriptionComponent,
    PaymentComponent
  ]
})
export class SubscriptionModule { }
