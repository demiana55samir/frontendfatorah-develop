import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { MainGeneralSettingsComponent } from './main-general-settings/main-general-settings.component';





const routes: Routes = [
    { path: '', redirectTo: 'All-entities', pathMatch: 'full' },
    { path: 'main', component: MainGeneralSettingsComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralSettingsRoutingModule {}
