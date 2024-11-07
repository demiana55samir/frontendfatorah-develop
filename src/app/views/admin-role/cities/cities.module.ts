import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesComponent } from './cities.component';
import { AllCitiesComponent } from './all-cities/all-cities.component';
import { DelectedCitiesComponent } from './delected-cities/delected-cities.component';
import { CityDetailsComponent } from './city-details/city-details.component';
import { AddEditCityComponent } from './add-edit-city/add-edit-city.component';
import { CitiesRoutingModule } from './cities.routing.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module'

@NgModule({
  imports: [
    CommonModule,
    CitiesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    CitiesComponent,
    AllCitiesComponent,
    DelectedCitiesComponent,
    CityDetailsComponent,
    AddEditCityComponent
  ]
})
export class CitiesModule { }
