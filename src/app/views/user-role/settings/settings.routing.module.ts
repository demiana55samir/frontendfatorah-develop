
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialAccountDetailsComponent } from './commercial-account-details/commercial-account-details.component';
import { AddBankAccountComponent } from './Add-bank-account/Add-bank-account.component';
import { DesignAndColorsComponent } from './design-and-colors/design-and-colors.component';



const routes: Routes = [
  { path: '', redirectTo: 'All-purchases', pathMatch: 'full' },
    { path: 'commercial-account-details', component: CommercialAccountDetailsComponent},
    { path: 'bank-accounts/add-bank-account/:type/:uuid', component: AddBankAccountComponent},
    { path: 'design-and-colors', component: DesignAndColorsComponent},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class settingsRoutingModule {}
