import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';

import { DebitNotesComponent } from './debit-notes.component';
import { DebitNotesRoutingModule } from './debit-notes.routing.module';
import { AllDebitNotesAdminComponent } from './all-debit-notes/all-debit-notes.component';
import { DebitNoteDetailsAdminComponent } from './debit-notes-details/debit-notes-details.component';


@NgModule({
  imports: [
    CommonModule,
    DebitNotesRoutingModule,
    FatoraTemplatesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    DebitNotesComponent,
    AllDebitNotesAdminComponent,
    DebitNoteDetailsAdminComponent
  ]
})
export class CreditNotesModule { }
