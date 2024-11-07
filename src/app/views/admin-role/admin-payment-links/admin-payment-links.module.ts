import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPaymentLinksComponent } from './admin-payment-links.component';
import { AdminPaymentLinksRoutingModule } from './admin-payment-links.routing.module';
import { AllPaymentLinksComponent } from './all-payment-links/all-payment-links.component';
import { PaymentLinkDetailsComponent } from './payment-link-details/payment-link-details.component';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';

@NgModule({
  imports: [
    CommonModule,
    AdminPaymentLinksRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    AdminPaymentLinksComponent,
    PaymentLinkDetailsComponent,
    AllPaymentLinksComponent,
  ]
})
export class AdminPaymentLinksModule { }
