import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { adminReportsRoutingModule } from './AdminReports.routing.module';
import { AdminUsersReportComponent } from './admin-users-report/admin-users-report.component';
import { AdminReportsComponent } from './adminReports.component';
import { ContinuingUsersReportComponent } from './continuing-users-report/continuing-users-report.component';
import { ExpiredSubscriptionsReportComponent } from './expired-subscriptions-report/expired-subscriptions-report.component';
import { IntermittentUsersReportComponent } from './intermittent-users-report/intermittent-users-report.component';
import { MonthlyIncomeReportComponent } from './monthly-income-report/monthly-income-report.component';
import { SharedModule } from '@modules/shared.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { TranslateModule } from '@ngx-translate/core';
import { TaxReturnsReportComponent } from './tax-returns-report/tax-returns-report.component';
import { UserSubscriptionsReportComponent } from './user-subscriptions-report/user-subscriptions-report.component';
import { InactiveReportComponent } from './inactiveReport/inactiveReport.component';

@NgModule({
  imports: [
    CommonModule,
    adminReportsRoutingModule,
    SharedModule,
    PrimNgModule,
    TranslateModule
  ],
  declarations: [
    AdminReportsComponent,
    AdminUsersReportComponent,
    ContinuingUsersReportComponent,
    ExpiredSubscriptionsReportComponent,
    IntermittentUsersReportComponent,
    MonthlyIncomeReportComponent,
    TaxReturnsReportComponent,
    UserSubscriptionsReportComponent,
    InactiveReportComponent
  ]
})
export class AdminReportsModule { }
