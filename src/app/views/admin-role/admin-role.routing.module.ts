import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '@modules/shared.module';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: () =>
      import('@modules/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'control',
    loadChildren: () =>
      import('@modules/admin-control-board.module').then((m) => m.AdminControlBoardModule),
  },
  {
    path: 'payment-links',
    loadChildren: () =>
      import('@modules/admin-payment-links.module').then((m) => m.AdminPaymentLinksModule),
  },
  {
    path: 'revenue',
    loadChildren: () =>
      import('@modules/Revenues.module').then((m) => m.RevenuesModule),
  },
  {
    path: 'quotations',
    loadChildren: () =>
      import('@modules/quotations.module').then((m) => m.QuotationsModule),
  },
  {
    path: 'credit-notes',
    loadChildren: () =>
      import('@modules/credit-notes.module').then((m) => m.CreditNotesModule),
  },
  {
    path: 'debit-notes',
    loadChildren: () =>
      import('@modules/debit-notes.module').then((m) => m.CreditNotesModule),
  },
  {

    path: 'settings/entities',
    loadChildren: () =>
      import('@modules/entities.module').then((m) => m.EntitiesModule),
  },
  {
    path: 'settings/general-settings',
    loadChildren: () =>
      import('@modules/general-settings.module').then((m) => m.GeneralSettingsModule),
  },
  {
    path: 'settings/cities',
    loadChildren: () =>
      import('@modules/cities.module').then((m) => m.CitiesModule),
  },
  {
    path: 'settings/activities',
    loadChildren: () =>
      import('@modules/activities.module').then((m) => m.ActivitiesModule),
  },
  {
    path: 'settings/categories',
    loadChildren: () =>
      import('@modules/categories-list.module').then((m) => m.CategoriesListModule),
  },
  {
    path: 'contact-us-messages',
    loadChildren: () =>
      import('@modules/contact-us-messages.module').then((m) => m.ContactUsMessagesModule),
  },
  {
    path: 'blogs',
    loadChildren: () =>
      import('@modules/blogs.module').then((m) => m.BlogsModule),
  },
  {
    path: 'templates',
    loadChildren: () =>
      import('@modules/templates.module').then((m) => m.TemplatesModule),
  },
  {
    path: 'receipt-vouchers',
    loadChildren: () =>
      import('@modules/receipt-vouchers.module').then((m) => m.ReceiptVouchersModule),
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('@modules/admin-invoices.module').then((m) => m.AdminInvoicesModule),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('@modules/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'coupons',
    loadChildren: () =>
      import('@modules/coupons.module').then((m) => m.CouponsModule),
  },
  {
    path: 'subscription-plans',
    loadChildren: () =>
      import('@modules/subscription-plans.module').then((m) => m.SubscriptionPlansModule),
  },
  {
    path: 'Admin-Reports',
    loadChildren: () =>
      import('@modules/adminReports.module').then((m) => m.AdminReportsModule)
  },

  {
    path: '**',
    redirectTo: 'landing',
    pathMatch: 'full',
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    SharedModule
  ],
})
export class AdminRoleRoutingModule { }
