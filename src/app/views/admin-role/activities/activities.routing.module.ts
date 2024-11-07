import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from 'app/core/guards/admin.guard';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { DeletedActivitiesComponent } from './deleted-activities/deleted-activities.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { AddEditActivityComponent } from './add-edit-activity/add-edit-activity.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-activities', pathMatch: 'full' },
    { path: 'All-activities', component: AllActivitiesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'deleted-activities', component: DeletedActivitiesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'activity-details/:id', component: ActivityDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'activity-data/:type/:id', component: AddEditActivityComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},


  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
