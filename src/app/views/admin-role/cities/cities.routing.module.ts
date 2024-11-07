import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllCitiesComponent } from './all-cities/all-cities.component';
import { DelectedCitiesComponent } from './delected-cities/delected-cities.component';
import { CityDetailsComponent } from './city-details/city-details.component';
import { AddEditCityComponent } from './add-edit-city/add-edit-city.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-cities', pathMatch: 'full' },
    { path: 'All-cities', component: AllCitiesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'deleted-cities', component: DelectedCitiesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'city-details/:id', component: CityDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'city-data/:type/:id', component: AddEditCityComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitiesRoutingModule {}
