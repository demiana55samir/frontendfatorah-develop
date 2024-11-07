import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from 'app/core/guards/admin.guard';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { DurationsListComponent } from './durations-list/durations-list.component';
import { AddEditDurationComponent } from './add-edit-duration/add-edit-duration.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-activities', pathMatch: 'full' },
    { path: 'All-categories', component: AllCategoriesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'category/:type/:id', component: AddEditCategoryComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},

    { path: 'duration/:type/:id', component: AddEditDurationComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'All-durations', component: DurationsListComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesListRoutingModule {}
