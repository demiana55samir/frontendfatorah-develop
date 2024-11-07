import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllEntitiesComponent } from './all-entities/all-entities.component';
import { DeletedEntitiesComponent } from './deleted-entities/deleted-entities.component';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { AddEditEntityComponent } from './add-edit-entity/add-edit-entity.component';




const routes: Routes = [
    { path: '', redirectTo: 'All-entities', pathMatch: 'full' },
    { path: 'All-entities', component: AllEntitiesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'deleted-entities', component: DeletedEntitiesComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'entity-details/:id', component: EntityDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},
    { path: 'entity-data/:type/:id', component: AddEditEntityComponent ,canActivate:[adminGuard], data: { permissionKey: 'settings.manage' }},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
