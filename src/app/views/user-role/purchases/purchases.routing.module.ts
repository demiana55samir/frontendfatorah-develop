import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPurchasesComponent } from './all-purchases/all-purchases.component';
import { CanceledPurchasesComponent } from './canceled-purchases/canceled-purchases.component';
import { AddPurchasesComponent } from './add-purchases/add-purchases.component';
import { PurchasesDetailsComponent } from './purchases-details/purchases-details.component';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { userGuard } from 'app/core/guards/user.guard';



const routes: Routes = [
  // { path: '', redirectTo: 'All-purchases', pathMatch: 'full' },
  //   { path: 'All-purchases', component: AllPurchasesComponent,canActivate:[AuthGuard,userGuard] },
  //   { path: 'canceled-purchases', component: CanceledPurchasesComponent,canActivate:[AuthGuard,userGuard]  },
  //   { path: 'add-purchases', component: AddPurchasesComponent ,canActivate:[AuthGuard,userGuard] },
  //   { path: 'edit-purchases/:uuid', component: AddPurchasesComponent ,canActivate:[AuthGuard,userGuard] },
  //   { path: 'purchases-details/:type/:uuid', component: PurchasesDetailsComponent ,canActivate:[AuthGuard,userGuard] },
  //   { path: 'purchases-details/viewOnly/:type/:uuid', component: PurchasesDetailsComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class purchasesRoutingModule {}
