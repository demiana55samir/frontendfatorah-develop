import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralSettingsComponent } from './general-settings.component';
import { MainGeneralSettingsComponent } from './main-general-settings/main-general-settings.component';
import { GeneralSettingsDataComponent } from './general-settings-data/general-settings-data.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { GeneralSettingsRoutingModule } from './general-settings.routing.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module'
@NgModule({
  imports: [
    CommonModule,
    GeneralSettingsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    GeneralSettingsComponent,
    MainGeneralSettingsComponent,
    GeneralSettingsDataComponent,
    TermsAndConditionsComponent
  ]
})
export class GeneralSettingsModule { }
