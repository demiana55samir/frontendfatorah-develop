import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponsComponent } from './coupons.component';
import { AllCouponsComponent } from './All-coupons/All-coupons.component';
import { AddEditCouponComponent } from './add-edit-coupon/add-edit-coupon.component';
import { CouponDetailsComponent } from './coupon-details/coupon-details.component';
import { CouponsRoutingModule } from './coupons.routing.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CouponsRoutingModule,
    PrimNgModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [
    CouponsComponent,
    AllCouponsComponent,
    AddEditCouponComponent,
    CouponDetailsComponent
  ]
})
export class CouponsModule { }
