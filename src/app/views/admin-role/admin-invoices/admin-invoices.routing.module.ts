import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllInvoicesComponent } from './all-invoices/all-invoices.component';
import { CancelledInvoicesComponent } from './cancelled-invoices/cancelled-invoices.component';
import { DeletedInvoicesComponent } from './deleted-invoices/deleted-invoices.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-invoices', pathMatch: 'full' },
    { path: 'All-invoices',
     component: AllInvoicesComponent ,
     canActivate:[adminGuard],
     data: { permissionKey: 'invoices.manage' }
    },
    { path: 'canceled-invoices',
     component: CancelledInvoicesComponent ,
     canActivate:[adminGuard],
     data: { permissionKey: 'invoices.manage' }
    },
    { path: 'deleted-invoices',
     component: DeletedInvoicesComponent ,
     canActivate:[adminGuard],
     data: { permissionKey: 'invoices.manage' }
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminInvoicesRoutingModule {}
