import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlBoardComponent } from './control-board.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { ControlBoardRoutingModule } from './control-board.routing.module';
import { LayoutModule } from 'app/views/layout/layout.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CardModule } from 'primeng/card';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';
import { SharedModule } from "../../shared-components/shared/shared.module";
import { NumberFormatPipe } from 'app/core/pipes/NumberFormat.pipe';


@NgModule({
    declarations: [
        ControlBoardComponent,
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        ControlBoardRoutingModule,
        LayoutModule,
        NgApexchartsModule,
        CardModule,
        FatoraTemplatesModule,
        SharedModule
    ],
    providers:[NumberFormatPipe]
})
export class ControlBoardModule { }
