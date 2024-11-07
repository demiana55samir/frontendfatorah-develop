import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersReportComponent } from './admin-users-report/admin-users-report.component';
import { ContinuingUsersReportComponent } from './continuing-users-report/continuing-users-report.component';
import { ExpiredSubscriptionsReportComponent } from './expired-subscriptions-report/expired-subscriptions-report.component';
import { IntermittentUsersReportComponent } from './intermittent-users-report/intermittent-users-report.component';
import { MonthlyIncomeReportComponent } from './monthly-income-report/monthly-income-report.component';
import { TaxReturnsReportComponent } from './tax-returns-report/tax-returns-report.component';
import { AdminSupportGuard } from 'app/core/guards/admin_support.guard';
import { adminGuard } from 'app/core/guards/admin.guard';
import { UserSubscriptionsReportComponent } from './user-subscriptions-report/user-subscriptions-report.component';
import { InactiveReportComponent } from './inactiveReport/inactiveReport.component';


const routes: Routes = [
    { path: '', redirectTo: 'users-report', pathMatch: 'full' },
    { path: 'users-report', component: AdminUsersReportComponent , canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
    { path: 'continuing-users-report', component: ContinuingUsersReportComponent , canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
    {path:'expired-subscriptions-report',component:ExpiredSubscriptionsReportComponent, canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
    {path:'intermittent-users-report',component:IntermittentUsersReportComponent, canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
    {path:'monthly-income-report',component:MonthlyIncomeReportComponent, canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
    {path:'tax-returns-report',component:TaxReturnsReportComponent, canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},

    {path:'user-subscriptions-report',component:UserSubscriptionsReportComponent, canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
    {path:'inactive-user-report',component:InactiveReportComponent, canActivate:[adminGuard],  data: { permissionKey: 'reports.view' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class adminReportsRoutingModule {}
