import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminGuard } from 'app/core/guards/admin.guard';
import { AdminSupportGuard } from 'app/core/guards/admin_support.guard';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { 
      path: 'dashboard',
     component: DashboardComponent ,
     canActivate:[adminGuard],
     data: { permissionKey: 'access.admin' }
    },


  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminControlBoardRoutingModule {}
