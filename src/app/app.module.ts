import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LayoutModule } from './views/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'  
import { ReactiveFormsModule} from '@angular/forms'
import { InterceptorsProvider } from './core/interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';

import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { SharedModule } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FatoraTemplatesRoutingModule } from '@modules/fatora-templates.routing.module';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';  // Arabic
import localeEn from '@angular/common/locales/en';  // English
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

registerLocaleData(localeAr);
registerLocaleData(localeEn);


// AoT requires an exported function for factoriesss
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    DropDownListModule,
    CheckBoxModule,
    SharedModule,
    NgxScannerQrcodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

  //   ToastrModule.forRoot({
  //     easing:'ease-in',
  //     // positionClass: 'toast-top-left',
  // }),
  ToastrModule.forRoot({
    easing:'ease-in',
   positionClass: 'toast-top',
}),
  NgxUiLoaderModule.forRoot({ masterLoaderId: 'loader' }),
  NgxUiLoaderRouterModule.forRoot({ loaderId: 'loader' }),
  ],
  providers: [
    InterceptorsProvider,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
