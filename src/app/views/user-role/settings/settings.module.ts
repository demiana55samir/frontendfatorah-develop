import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { CommercialAccountDetailsComponent } from './commercial-account-details/commercial-account-details.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { LogoAndSealComponent } from './logo-and-seal/logo-and-seal.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { AddBankAccountComponent } from './Add-bank-account/Add-bank-account.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { DesignAndColorsComponent } from './design-and-colors/design-and-colors.component';
import { AllInvoiceTemplatesComponent } from './All-invoice-templates/All-invoice-templates.component';
import { ColorsComponent } from './colors/colors.component';
import { settingsRoutingModule } from './settings.routing.module';
import { LayoutModule } from 'app/views/layout/layout.module';
// import { SharedModule } from '@modules/shared.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';

@NgModule({
    declarations: [
        SettingsComponent,
        CommercialAccountDetailsComponent,
        AccountDetailsComponent,
        BankAccountsComponent,
        AddBankAccountComponent,
        GeneralSettingsComponent,
        DesignAndColorsComponent,
        LogoAndSealComponent,
        ColorsComponent,
        AllInvoiceTemplatesComponent
    ],
    imports: [
        CommonModule,
        LayoutModule,
        SharedModule,
        PrimNgModule,
        settingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FatoraTemplatesModule
    ]
})
export class SettingsModule { }
