import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllRevenuesComponent } from './all-revenues/all-revenues.component';
import { AdminSupportGuard } from 'app/core/guards/admin_support.guard';


const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-revenues', component: AllRevenuesComponent ,canActivate:[adminGuard], data: { permissionKey: 'revenues.view' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevenuesRoutingModule {}
