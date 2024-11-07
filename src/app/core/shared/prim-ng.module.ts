import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { GalleriaModule } from 'primeng/galleria'
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { AccordionModule } from 'primeng/accordion';
import { PasswordModule } from 'primeng/password';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import {ChartModule} from 'primeng/chart';
import { EditorModule } from 'primeng/editor';
// import {CarouselModule} from 'primeng/carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';

import {InputMaskModule} from 'primeng/inputmask';



@NgModule({
  imports:[
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ProgressBarModule,
    TabViewModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    CheckboxModule,
    MultiSelectModule,
    MenuModule,
    GalleriaModule,
    DialogModule,
    RatingModule,
    AccordionModule,
    PasswordModule,
    TabMenuModule,
    PaginatorModule,
    InputSwitchModule,
    ChartModule,
    EditorModule,
    CarouselModule,
    InputMaskModule
  ],
  exports: [
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ProgressBarModule,
    TabViewModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    CheckboxModule,
    MultiSelectModule,
    MenuModule,
    GalleriaModule,
    DialogModule,
    RatingModule,
    AccordionModule,
    PasswordModule,
    TabMenuModule,
    PaginatorModule,
    InputSwitchModule,
    EditorModule,
    CarouselModule,
    InputMaskModule
  ],
})
export class PrimNgModule { }
