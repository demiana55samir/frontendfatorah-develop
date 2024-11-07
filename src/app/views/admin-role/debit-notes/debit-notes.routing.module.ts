import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from 'app/core/guards/admin.guard';
import { AllDebitNotesAdminComponent } from './all-debit-notes/all-debit-notes.component';
import { DebitNoteDetailsAdminComponent } from './debit-notes-details/debit-notes-details.component';


const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-debit-notes', component: AllDebitNotesAdminComponent ,canActivate:[adminGuard], data: { permissionKey: 'all.manage' }},
    { path: 'debit-note-details/:uuid', component: DebitNoteDetailsAdminComponent ,canActivate:[adminGuard], data: { permissionKey: 'all.manage' }},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitNotesRoutingModule {}
