import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { AddReceiptVoucherComponent } from './Add-receipt-voucher/Add-receipt-voucher.component';
import { AllInvoicesPageComponent } from './All-invoices-page/All-invoices-page.component';
import { AddInvoicesComponent } from './add-invoices/add-invoices.component';
import { CanceledInvoicesComponent } from './canceled-invoices/canceled-invoices.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { ReceiptVoucherDetailsComponent } from './receipt-voucher-details/receipt-voucher-details.component';
import { AllReceiptVoucherComponent } from './All-receipt-voucher/All-receipt-voucher.component';
import { InvoicesRoutingModule } from './invoices.routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from 'app/views/layout/layout.module';
import { CheckboxModule } from 'primeng/checkbox';
import {TabMenuModule} from 'primeng/tabmenu';
import { AllCreditNotesComponent } from './All-credit-notes/All-credit-notes.component';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { SharedModule } from '@modules/shared.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { AllDebitNotesComponent } from './All-debit-notes/All-debit-notes.component';
import { CreditNoteDetailsComponent } from './Credit-Note-details/Credit-Note-details.component';
import { DebitNoteDetailsComponent } from './Debit-Note-details/Debit-Note-details.component';





@NgModule({
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    DropdownModule,
    TableModule,
    LayoutModule,
    CheckboxModule,
    TableModule,
    TabMenuModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FatoraTemplatesModule,
    PrimNgModule
  ],
  
  declarations: [
    InvoicesComponent,
    InvoiceDetailsComponent,
    CanceledInvoicesComponent,
    AllInvoicesPageComponent,
    AllCreditNotesComponent,
    AddReceiptVoucherComponent,
    AddInvoicesComponent,
    CreditNoteDetailsComponent,
    ReceiptVoucherDetailsComponent,
    AllReceiptVoucherComponent,
    AllDebitNotesComponent,
    DebitNoteDetailsComponent
  ]
})
export class InvoicesModule { }
