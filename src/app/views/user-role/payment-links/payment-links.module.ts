import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentLinksComponent } from './payment-links.component';
import { AllPaymentLinksComponent } from './All-payment-links/All-payment-links.component';
import { PaymentLinkDetailsComponent } from './payment-link-details/payment-link-details.component';
import { BalanceTransferRequestsComponent } from './balance-transfer-requests/balance-transfer-requests.component';
import { PaymentLinksRoutingModule } from './payment-links-routing.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { LayoutModule } from 'app/views/layout/layout.module';



@NgModule({
  imports: [
    CommonModule,
    PaymentLinksRoutingModule,
    LayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PrimNgModule
  ],
  declarations: [
    PaymentLinksComponent,
    AllPaymentLinksComponent,
    PaymentLinkDetailsComponent,
    BalanceTransferRequestsComponent
  ]
})
export class PaymentLinksModule { }
