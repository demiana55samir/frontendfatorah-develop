import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { InvoiceTemplateComponent } from '@modules/invoice-template/invoice-template.component';

const routes: Routes = [
  { path: '', redirectTo: 'All-invoices', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'invoice-template', component: InvoiceTemplateComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlBoardRoutingModule {}
