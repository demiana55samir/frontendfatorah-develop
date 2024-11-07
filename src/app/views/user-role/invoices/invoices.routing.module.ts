import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllInvoicesPageComponent } from './All-invoices-page/All-invoices-page.component';
import { AddInvoicesComponent } from './add-invoices/add-invoices.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { CanceledInvoicesComponent } from './canceled-invoices/canceled-invoices.component';
import { AddReceiptVoucherComponent } from './Add-receipt-voucher/Add-receipt-voucher.component';
import { AllCreditNotesComponent } from './All-credit-notes/All-credit-notes.component';

import { ReceiptVoucherDetailsComponent } from './receipt-voucher-details/receipt-voucher-details.component';
import { AllReceiptVoucherComponent } from './All-receipt-voucher/All-receipt-voucher.component';
import { userGuard } from 'app/core/guards/user.guard';
import { AllDebitNotesComponent } from './All-debit-notes/All-debit-notes.component';
import { CreditNoteDetailsComponent } from './Credit-Note-details/Credit-Note-details.component';
import { DebitNoteDetailsComponent } from './Debit-Note-details/Debit-Note-details.component';


const routes: Routes = [
  { path: '', redirectTo: 'All-invoices', pathMatch: 'full' },
    { path: 'All-invoices', component: AllInvoicesPageComponent,canActivate:[userGuard] },
    { path: 'Add-invoices', component: AddInvoicesComponent ,canActivate:[userGuard]},
    { path: 'Add-invoices/:uuid', component: AddInvoicesComponent ,canActivate:[userGuard]},
    
    { path: 'invoice-details/:uuid', component: InvoiceDetailsComponent,canActivate:[userGuard] },
    { path: 'invoice-details/viewOnly/:uuid', component: InvoiceDetailsComponent},
    { path: 'canceled-invoices', component: CanceledInvoicesComponent,canActivate:[userGuard] },
    { path: 'add-voucher/:uuid', component: AddReceiptVoucherComponent ,canActivate:[userGuard]},
    { path: 'All-credit-notes', component: AllCreditNotesComponent,canActivate:[userGuard] },
    { path: 'All-debit-notes', component: AllDebitNotesComponent,canActivate:[userGuard] },
    { path: 'add-credit-note/:type/:uuid', component: CreditNoteDetailsComponent ,canActivate:[userGuard]},
    { path: 'credit-note-details/:type/:uuid', component: CreditNoteDetailsComponent ,canActivate:[userGuard]},
    { path: 'debit-note-details/:type/:uuid', component: DebitNoteDetailsComponent ,canActivate:[userGuard]},
    { path: 'receipt-voucher-details/:uuid', component: ReceiptVoucherDetailsComponent,canActivate:[userGuard] },
    {path:'All-receipt-voucher',component:AllReceiptVoucherComponent ,canActivate:[userGuard]}

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {}
