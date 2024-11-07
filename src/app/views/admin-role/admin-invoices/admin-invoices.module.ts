import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminInvoicesComponent } from './admin-invoices.component';
import { AllInvoicesComponent } from './all-invoices/all-invoices.component';
import { AdminInvoicesRoutingModule } from './admin-invoices.routing.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { DeletedInvoicesComponent } from './deleted-invoices/deleted-invoices.component';
import { CancelledInvoicesComponent } from './cancelled-invoices/cancelled-invoices.component';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';


@NgModule({
  imports: [
    CommonModule,
    AdminInvoicesRoutingModule,
    FatoraTemplatesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    AdminInvoicesComponent,
    AllInvoicesComponent,
    CancelledInvoicesComponent,
    DeletedInvoicesComponent
  ]
})
export class AdminInvoicesModule { }
