import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonCompComponent } from './button-comp/button-comp.component';
import { FormErrorsComponent } from './Form-errors/Form-errors.component';
import { ReportsChartsComponent } from './reports-charts/reports-charts.component';
import { AutoTabDirectiveDirective } from './directives/auto-tab-directive.directive';
import { CreatePaymentLinkComponent } from './create-payment-link/create-payment-link.component';
import { OwlCarouselComponent } from './owl-carousel/owl-carousel.component';
import { DataCardComponent } from './dataCard/dataCard.component';
import { DeleteErrorPopupComponent } from './delete-error-popup/delete-error-popup.component';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TranslateModule } from '@ngx-translate/core';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableCompComponent } from './table-comp/table-comp.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FatoraTemplatesModule } from 'app/views/fatora-templates/fatora-templates.module';
import { SortPipe } from 'app/core/pipes/sort.pipe';
import { NumberFormatPipe } from 'app/core/pipes/NumberFormat.pipe';
import { OnlyNumberDirective } from 'app/core/directives/OnlyNumber.directive';
import { PercentagePipe } from 'app/core/pipes/percentage.pipe';
import { OnlyDecimalNumberDirective } from 'app/core/directives/OnlyDecimalNumber.directive';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { OnlyIntegersNumberDirective } from 'app/core/directives/onlyIntegersNumber.directive';
import { OnlyPositiveNumberDirective } from 'app/core/directives/OnlyPostiveNumber.directive';
import { TwoDigitFloatNumber } from 'app/core/directives/TwoDigitFloatNumber.directive';

@NgModule({
  declarations: [
    ButtonCompComponent,
    FormErrorsComponent,
    CreatePaymentLinkComponent,
    TableCompComponent,
    DataCardComponent,
    ReportsChartsComponent,
    AutoTabDirectiveDirective,
    DeleteErrorPopupComponent,
    OwlCarouselComponent,
    SortPipe,
    NumberFormatPipe,
    OnlyNumberDirective,
    OnlyPositiveNumberDirective,
    PercentagePipe,
    OnlyDecimalNumberDirective ,
    OnlyIntegersNumberDirective,
    TwoDigitFloatNumber
  ],
 
  imports: [
    CommonModule,
    PrimNgModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    QRCodeModule,
    FatoraTemplatesModule,
    TranslateModule,
    NgxScannerQrcodeModule
  ],
  exports:[
    ButtonCompComponent,
    FormErrorsComponent,
    CreatePaymentLinkComponent,
    TableCompComponent,
    DataCardComponent,
    ReportsChartsComponent,
    QRCodeModule,
    AutoTabDirectiveDirective,
    DeleteErrorPopupComponent,
    OwlCarouselComponent,
    SortPipe,
    NumberFormatPipe,
    OnlyNumberDirective,
    OnlyPositiveNumberDirective,
    PercentagePipe ,
    OnlyDecimalNumberDirective,
    NgxScannerQrcodeModule,
    OnlyIntegersNumberDirective,
    TwoDigitFloatNumber
],
})
export class SharedModule { }
