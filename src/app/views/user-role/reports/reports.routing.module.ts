import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { CollectionReportComponent } from './Collection-Report/Collection-Report.component';
import { CustomerAccountStatementReportComponent } from './customer-account-statement-report/customer-account-statement-report.component';
import { TaxComponent } from './Tax/Tax.component';
import { EarningsReportComponent } from './earnings-report/earnings-report.component';
import { PurchaseReportComponent } from './purchaseReport/purchaseReport.component';
import { AddTaxReportComponent } from './add-tax-report/add-tax-report.component';
import { Profit_Loss_ReportComponent } from './Profit_Loss_Report/Profit_Loss_Report.component';



const routes: Routes = [
  { path: '', redirectTo: 'All-purchases', pathMatch: 'full' },
    { path: 'sales-report', component: SalesReportComponent },
    { path: 'collection-report', component: CollectionReportComponent },
    {path:'customer-account-statement-report',component:CustomerAccountStatementReportComponent},
    {path:'purchases-report',component:PurchaseReportComponent},
    // {path:'tax-returns-report',component:TaxComponent},
    {path:'earnings-report-report',component:EarningsReportComponent},
    // {path:'add-tax-report',component:AddTaxReportComponent},
    // {path:'add-tax-report/:type',component:AddTaxReportComponent},
    // {path:'add-tax-report/:type/:id',component:AddTaxReportComponent},
    
    {path:'Profit_Loss_Report',component:Profit_Loss_ReportComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class reportsRoutingModule {}
