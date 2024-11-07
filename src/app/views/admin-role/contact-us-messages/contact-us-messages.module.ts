import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsMessagesComponent } from './contact-us-messages.component';
import { ContactUsMessagesRoutingModule } from './contact-us-messages.routing.module';
import { AllMessagesComponent } from './all-messages/all-messages.component';
import { MessageDetailsComponent } from './message-details/message-details.component';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@modules/shared.module';
import { SendEmailComponent } from './send-email/send-email.component';
import { SendWhatsappComponent } from './send-whatsapp/send-whatsapp.component';

@NgModule({
  imports: [
    CommonModule,
    ContactUsMessagesRoutingModule,
    SharedModule,
    PrimNgModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    ContactUsMessagesComponent,
    AllMessagesComponent,
    MessageDetailsComponent,
    SendEmailComponent,
    SendWhatsappComponent
  ]
})
export class ContactUsMessagesModule { }
