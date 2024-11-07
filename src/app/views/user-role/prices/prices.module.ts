import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { pricesRoutingModule } from './prices.routing.module';
import { PricesListComponent } from './prices-list/prices-list.component';
import { AddPriceOfferComponent } from './add-price-offer/add-price-offer.component';
import { PriceOffersDetailsComponent } from './price-offers-details/price-offers-details.component';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { SharedModule } from '@modules/shared.module';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { TranslateModule } from '@ngx-translate/core';






@NgModule({
  imports: [
    CommonModule, 
    pricesRoutingModule,
    PrimNgModule,
    SharedModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    FatoraTemplatesModule,
    TranslateModule
  ],
  declarations: [
    PricesComponent,
    PricesListComponent,
    AddPriceOfferComponent,
    PriceOffersDetailsComponent
  ]
})
export class PricesModule { }
