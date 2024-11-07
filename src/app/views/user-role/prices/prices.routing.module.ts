import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricesListComponent } from './prices-list/prices-list.component';
import { AddPriceOfferComponent } from './add-price-offer/add-price-offer.component';
import { PriceOffersDetailsComponent } from './price-offers-details/price-offers-details.component';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { userGuard } from 'app/core/guards/user.guard';




const routes: Routes = [
  { path: '', redirectTo: 'price-list', pathMatch: 'full' },
    {path:'price-list',component:PricesListComponent,canActivate:[AuthGuard,userGuard]},
    {path:'add-price-offer',component:AddPriceOfferComponent,canActivate:[AuthGuard,userGuard]},
    {path:'price-offers-details/:uuid',component:PriceOffersDetailsComponent,canActivate:[AuthGuard,userGuard]},
    {path:'price-offers-details/viewOnly/:uuid',component:PriceOffersDetailsComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class pricesRoutingModule {}
