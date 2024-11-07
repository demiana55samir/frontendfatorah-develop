import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard} from 'app/core/guards/admin.guard';
import { ReceiptVouchersListComponent } from './receipt-vouchers-list/receipt-vouchers-list.component';
import { ReceiptVoucherDetailsComponent } from './receipt-voucher-details/receipt-voucher-details.component';
import { CancelledReceiptVouchersComponent } from './cancelled-receipt-vouchers/cancelled-receipt-vouchers.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-receipt-vouchers', component: ReceiptVouchersListComponent ,canActivate:[adminGuard], data: { permissionKey: 'receipts.manage' }},
    { path: 'cancelled-receipt-vouchers', component: CancelledReceiptVouchersComponent ,canActivate:[adminGuard], data: { permissionKey: 'receipts.manage' }},
    { path: 'receipt-voucher-details/:uuid', component: ReceiptVoucherDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'receipts.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptVouchersRoutingModule {}
