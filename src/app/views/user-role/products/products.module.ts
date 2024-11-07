import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { LayoutModule } from 'app/views/layout/layout.module';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsInvoicesComponent } from './products-invoices/products-invoices.component';
import { ProductQuotationsComponent } from './product-quotations/product-quotations.component';
import { ProductsRoutingModule } from './products.routing.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { NgApexchartsModule } from 'ng-apexcharts';




@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    LayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    PrimNgModule,
    NgApexchartsModule,

  ],
  declarations: [
    ProductsComponent,
    AddProductComponent,
    AllProductsComponent,
    ProductDetailsComponent,
    ProductsInvoicesComponent,
    ProductQuotationsComponent
  ]
})
export class ProductsModule { }
