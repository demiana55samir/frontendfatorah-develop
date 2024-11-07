import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AllCreditNotesComponent } from './all-credit-notes/all-credit-notes.component';
import { CreditNotesDetailsComponent } from './credit-notes-details/credit-notes-details.component';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-credit-notes', component: AllCreditNotesComponent ,canActivate:[adminGuard], data: { permissionKey: 'all.manage' }},
    { path: 'credit-note-details/:uuid', component: CreditNotesDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'all.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditNotesRoutingModule {}
