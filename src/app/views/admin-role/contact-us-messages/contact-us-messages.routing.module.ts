import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from 'app/core/guards/admin.guard';
import { AllMessagesComponent } from './all-messages/all-messages.component';
import { MessageDetailsComponent } from './message-details/message-details.component';
import { AdminSupportGuard } from 'app/core/guards/admin_support.guard';
import { SendEmailComponent } from './send-email/send-email.component';
import { SendWhatsappComponent } from './send-whatsapp/send-whatsapp.component';

const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-messages', component: AllMessagesComponent ,canActivate:[adminGuard], data: { permissionKey: 'contact_us.manage' }},
    { path: 'message-details/:id', component: MessageDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'contact_us.manage' }},
    
    // todo: hold for now
    { path: 'send-email', component: SendEmailComponent ,canActivate:[adminGuard], data: { permissionKey: 'contact_us.manage' }},
    // { path: 'send-whatsapp', component: SendWhatsappComponent ,canActivate:[adminGuard], data: { permissionKey: 'contact_us.manage' }},
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUsMessagesRoutingModule {}
