import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlBoardComponent } from './admin-control-board.component';
import { AdminControlBoardRoutingModule } from './admin-control-board.routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import {ChartModule} from 'primeng/chart';
import { NumberFormatPipe } from 'app/core/pipes/NumberFormat.pipe';





@NgModule({
  imports: [
    CommonModule,
    AdminControlBoardRoutingModule,
    SharedModule,
    TranslateModule,
    PrimNgModule,
    NgApexchartsModule,
    ChartModule
  ],
  declarations: [
    AdminControlBoardComponent,
    DashboardComponent
  ],
  providers:[NumberFormatPipe]
})
export class AdminControlBoardModule { }
