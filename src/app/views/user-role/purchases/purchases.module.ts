import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesComponent } from './purchases.component';
import { AllPurchasesComponent } from './all-purchases/all-purchases.component';
import { CanceledPurchasesComponent } from './canceled-purchases/canceled-purchases.component';
import { AddPurchasesComponent } from './add-purchases/add-purchases.component';
import { PurchasesDetailsComponent } from './purchases-details/purchases-details.component';
import { purchasesRoutingModule } from './purchases.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from 'app/views/layout/layout.module';
import { SharedModule } from '@modules/shared.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { TableModule } from 'primeng/table';
import { NgxDropzoneModule } from 'ngx-dropzone';





@NgModule({
  imports: [
    CommonModule,
    purchasesRoutingModule,
    LayoutModule,
    SharedModule,
    PrimNgModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  declarations: [
    PurchasesComponent,
    AllPurchasesComponent,
    CanceledPurchasesComponent,
    AddPurchasesComponent,
    PurchasesDetailsComponent
  ]
})
export class PurchasesModule { }
