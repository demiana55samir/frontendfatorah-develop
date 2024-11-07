import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptVouchersComponent } from './receipt-vouchers.component';
import { ReceiptVouchersListComponent } from './receipt-vouchers-list/receipt-vouchers-list.component';
import { ReceiptVoucherDetailsComponent } from './receipt-voucher-details/receipt-voucher-details.component';
import { CancelledReceiptVouchersComponent } from './cancelled-receipt-vouchers/cancelled-receipt-vouchers.component';


import { ReceiptVouchersRoutingModule } from './receipt-vouchers.routing.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';

@NgModule({
  imports: [
    CommonModule,
    FatoraTemplatesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule,
    ReceiptVouchersRoutingModule
  ],
  declarations: [
    ReceiptVouchersComponent,
    ReceiptVouchersListComponent,
    ReceiptVoucherDetailsComponent,
    CancelledReceiptVouchersComponent
  ]
})
export class ReceiptVouchersModule { }
