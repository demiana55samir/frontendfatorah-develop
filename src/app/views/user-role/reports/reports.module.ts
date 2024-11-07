import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reportsRoutingModule } from './reports.routing.module';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { CollectionReportComponent } from './Collection-Report/Collection-Report.component';
import { CustomerAccountStatementReportComponent } from './customer-account-statement-report/customer-account-statement-report.component';
import { ReportsComponent } from './reports.component';
import { LayoutModule } from 'app/views/layout/layout.module';
import { SharedModule } from '@modules/shared.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { TaxComponent } from './Tax/Tax.component';
import { EarningsReportComponent } from './earnings-report/earnings-report.component';
import { PurchaseReportComponent } from './purchaseReport/purchaseReport.component';
import { AddTaxReportComponent } from './add-tax-report/add-tax-report.component';
import { Profit_Loss_ReportComponent } from './Profit_Loss_Report/Profit_Loss_Report.component';

@NgModule({
  imports: [
    CommonModule,
    reportsRoutingModule,
    LayoutModule,
    SharedModule,
    PrimNgModule
  ],
  declarations: [
    ReportsComponent,
    SalesReportComponent,
    CollectionReportComponent,
    CustomerAccountStatementReportComponent,
    EarningsReportComponent,
    TaxComponent,
    PurchaseReportComponent,
    AddTaxReportComponent,
    Profit_Loss_ReportComponent
  ]
})
export class ReportsModule { }
