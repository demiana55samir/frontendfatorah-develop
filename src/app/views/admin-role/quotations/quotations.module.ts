import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsComponent } from './quotations.component';
import { AllQuotationsComponent } from './all-quotations/all-quotations.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { QuotationssRoutingModule } from './quotations.routing.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';

@NgModule({
  imports: [
    CommonModule,
    FatoraTemplatesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule,
    QuotationssRoutingModule
  ],
  declarations: [
    QuotationsComponent,
    AllQuotationsComponent,
    QuotationDetailsComponent
  ]
})
export class QuotationsModule { }
