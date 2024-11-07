import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { landingRoutingModule } from './landing.routing.module';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@modules/shared.module';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
@NgModule({
  imports: [
    CommonModule,
    landingRoutingModule,
    SharedModule,
    PrimNgModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    LandingFooterComponent,
    LandingHeaderComponent,
    LandingPageComponent
  ]
})
export class LandingModule { }
