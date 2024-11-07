import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { ControlBoardComponent } from '@modules/control-board.component';
import { UserComponent } from './user/user.component';
import { ProductsComponent } from '@modules/products.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { ReportsComponent } from '@modules/reports.component';
import { LoginComponent } from '@modules/login/login.component';
import { loginGuard } from 'app/core/guards/login.guard';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { PaymentLinksComponent } from './payment-links/payment-links.component';
import { SettingsModule } from '@modules/settings.module';
import { SettingsComponent } from '@modules/settings.component';
import { SubscriptionAndPaymentComponent } from '@modules/subscriptionAndPayment/subscriptionAndPayment.component';
import { SubscriptionComponent } from '@modules/subscription.component';
import { userGuard } from 'app/core/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'invoices',
    component:InvoicesComponent,
    loadChildren: () =>
      import('@modules/invoices.module').then((m) => m.InvoicesModule),
      // canActivate:[AuthGuard]
      // canActivate:[userGuard]
      

  },
  {
    path: 'control',
    loadChildren: () =>
      import('@modules/control-board.module').then((m) => m.ControlBoardModule),
      canActivate:[AuthGuard]

  },
  {
    path: 'products',
    component:ProductsComponent,
    loadChildren: () =>
      import('@modules/products.module').then((m) => m.ProductsModule),
      canActivate:[AuthGuard,userGuard]

  },

  {
    path: 'users',
    component:UserComponent,
    loadChildren: () =>
      import('@modules/user.module').then((m) => m.UserModule),
      canActivate:[AuthGuard,userGuard]

  },
  {
    path: 'settings',
    component:SettingsComponent,
    loadChildren: () =>
      import('@modules/settings.module').then((m) => m.SettingsModule),
      canActivate:[AuthGuard,userGuard]

  },
  {
    path: 'purchases', 
    component:PurchasesComponent,
    loadChildren: () =>
      import('@modules/purchases.module').then((m) => m.PurchasesModule),
      // canActivate:[userGuard]

  },
  {
    path: 'prices', 
    component:PurchasesComponent,
    loadChildren: () =>
      import('@modules/prices.module').then((m) => m.PricesModule),
      

  },
  {
    path: 'payment-links', 
    component:PaymentLinksComponent,
    loadChildren: () =>
      import('@modules/payment-links.module').then((m) => m.PaymentLinksModule),
      canActivate:[AuthGuard,userGuard]

  }, 
  {
    path: 'reports',
    component:ReportsComponent,
    loadChildren: () =>
      import('@modules/reports.module').then((m) => m.ReportsModule),
      canActivate:[AuthGuard,userGuard]

  },
  {
    path: 'Subscription',
    component:SubscriptionComponent,
    loadChildren: () =>
      import('@modules/subscription.module').then((m) => m.SubscriptionModule),
      canActivate:[userGuard]
  },
  {
    path: 'Templates',
    loadChildren: () =>
      import('@modules/fatora-templates.module').then((m) => m.FatoraTemplatesModule),
      canActivate:[userGuard]
  },
  {
    path: '**',
    redirectTo: 'landing',
    pathMatch: 'full',
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoleRoutingModule { }
