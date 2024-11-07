import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllTemplatesComponent } from './all-templates/all-templates.component';
import { AddEditTemplateComponent } from './add-edit-template/add-edit-template.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-templates', component: AllTemplatesComponent ,canActivate:[adminGuard], data: { permissionKey: 'templates.manage' }},
    { path: 'template-data/:type/:id', component: AddEditTemplateComponent ,canActivate:[adminGuard], data: { permissionKey: 'templates.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
