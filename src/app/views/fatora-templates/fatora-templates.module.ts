import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FatoraTemplatesComponent } from './fatora-templates.component';
import { InvoiceTemplateComponent } from './invoice-template/invoice-template.component';
import { QuotationTemplatesComponent } from './quotation-templates/quotation-templates.component';
import { SubscriptionTemplateComponent } from './subscription-template/subscription-template.component';
import { FatoraTemplatesRoutingModule } from './fatora-templates.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewInvoiceTemplatesComponent } from './new-invoice-templates/new-invoice-templates.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,QRCodeModule,TranslateModule,FatoraTemplatesRoutingModule
  ],
  declarations: [
    FatoraTemplatesComponent,
    InvoiceTemplateComponent,
    QuotationTemplatesComponent,
    SubscriptionTemplateComponent,
    NewInvoiceTemplatesComponent
  ],
    exports:[
      InvoiceTemplateComponent,
      QuotationTemplatesComponent,
      SubscriptionTemplateComponent,
      NewInvoiceTemplatesComponent
    ]
})
export class FatoraTemplatesModule { }
