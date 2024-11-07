import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from 'app/core/guards/admin.guard';
import { AllCouponsComponent } from './All-coupons/All-coupons.component';
import { AddEditCouponComponent } from './add-edit-coupon/add-edit-coupon.component';
import { CouponDetailsComponent } from './coupon-details/coupon-details.component';


const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-coupons', component: AllCouponsComponent ,canActivate:[adminGuard], data: { permissionKey: 'vouchers.manage' }},
    { path: 'coupon-details/:type/:id', component: AddEditCouponComponent ,canActivate:[adminGuard], data: { permissionKey: 'vouchers.manage' }},
    { path: 'coupon-details/:id', component:CouponDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'vouchers.manage' }},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponsRoutingModule {}
