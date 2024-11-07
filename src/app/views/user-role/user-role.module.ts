import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleComponent } from './user-role.component';
import { UserRoleRoutingModule } from './user-role.routing.module';
import { LayoutModule } from '../layout/layout.module';
import { ControlBoardModule } from '@modules/control-board.module';
import { InvoicesModule } from '@modules/invoices.module';
import { PaymentLinksModule } from '@modules/payment-links.module';
import { PricesModule } from '@modules/prices.module';
import { ProductsModule } from '@modules/products.module';
import { ReportsModule } from '@modules/reports.module';
import { SettingsModule } from '@modules/settings.module';
import { SubscriptionModule } from '@modules/subscription.module';
import { UserModule } from '@modules/user.module';
import { NumberFormatPipe } from 'app/core/pipes/NumberFormat.pipe';
import { SharedModule } from '@modules/shared.module';


@NgModule({
  imports: [
    CommonModule,
    UserRoleRoutingModule,
    LayoutModule,
    ControlBoardModule,
    InvoicesModule,
    PaymentLinksModule,
    PricesModule,
    ProductsModule,
    ReportsModule,
    SettingsModule,
    SubscriptionModule,
    UserModule,
    SharedModule
  ],
  declarations: [UserRoleComponent,]
})
export class UserRoleModule { }
