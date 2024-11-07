import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SideNavbarComponent } from './sideNavbar/sideNavbar.component';
import { AccordionModule } from 'primeng/accordion';
import { HeaderComponent } from './header/header.component';

@NgModule({
    imports: [ 
        CommonModule,
        RouterModule,
        TranslateModule,
        AccordionModule
    ],
    exports:[
         TranslateModule,
         SideNavbarComponent,
         HeaderComponent,
         AccordionModule
    ],
    providers:[],
    declarations: [ SideNavbarComponent ,  HeaderComponent ]
})
export class LayoutModule { }
