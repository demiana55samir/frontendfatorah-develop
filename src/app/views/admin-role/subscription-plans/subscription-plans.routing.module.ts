import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from 'app/core/guards/admin.guard';
import { AllPlansComponent } from './all-plans/all-plans.component';
import { AddEditPlanComponent } from './add-edit-plan/add-edit-plan.component';
import { GeneralPlanDetailsComponent } from './general-plan-details/general-plan-details.component';
import { AddFeatureComponent } from './add-feature/add-feature.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { EditDurationComponent } from './edit-duration/edit-duration.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-plans', component: AllPlansComponent ,canActivate:[adminGuard], data: { permissionKey: 'plans.manage' }},
    { path: 'plan-details/:type/:id', component: AddEditPlanComponent ,canActivate:[adminGuard], data: { permissionKey: 'plans.manage' }},
    { path: 'General-plan-details/:tab/:id', component: GeneralPlanDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'plans.manage' }},
    { path: 'feature-details/:type/:PlanId/:featureId', component: AddFeatureComponent ,canActivate:[adminGuard], data: { permissionKey: 'plans.manage' }},
    { path: 'duration-details/:type/:PlanId/:durationId', component: EditDurationComponent ,canActivate:[adminGuard], data: { permissionKey: 'plans.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPlansRoutingModule {}
