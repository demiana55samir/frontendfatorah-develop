import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditNotesComponent } from './credit-notes.component';
import { AllCreditNotesComponent } from './all-credit-notes/all-credit-notes.component';
import { CreditNotesDetailsComponent } from './credit-notes-details/credit-notes-details.component';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { CreditNotesRoutingModule } from './credit-notes.routing.module';

@NgModule({
  imports: [
    CommonModule,
    CreditNotesRoutingModule,
    FatoraTemplatesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    CreditNotesComponent,
    AllCreditNotesComponent,
    CreditNotesDetailsComponent
  ]
})
export class CreditNotesModule { }
