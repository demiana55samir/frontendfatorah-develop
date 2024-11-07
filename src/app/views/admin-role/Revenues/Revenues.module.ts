import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenuesComponent } from './Revenues.component';
import { AllRevenuesComponent } from './all-revenues/all-revenues.component';
import { RevenuesRoutingModule } from './Revenues.routing.module';
import { SharedModule } from '@modules/shared.module';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RevenuesRoutingModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    RevenuesComponent,
    AllRevenuesComponent
  ]
})
export class RevenuesModule { }
