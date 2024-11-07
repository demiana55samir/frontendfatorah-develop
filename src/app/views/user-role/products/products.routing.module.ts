import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsInvoicesComponent } from './products-invoices/products-invoices.component';
import { ProductQuotationsComponent } from './product-quotations/product-quotations.component';

const routes: Routes = [
    { path: '', redirectTo: 'All-products', pathMatch: 'full' },
    { path: 'All-products', component: AllProductsComponent },
    { path: 'Add-products/:type/:uuid', component: AddProductComponent },
    {path:'product-details/:id',component:ProductDetailsComponent},
    {path:'product-invoices/:id',component:ProductsInvoicesComponent},
    // {path:'product-price-offers/:id',component:ProductQuotationsComponent}
    {path:'product-price-offers/:id',component:ProductQuotationsComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
