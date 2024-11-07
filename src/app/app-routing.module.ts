import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from './core/guards/login.guard';
import { UserRoleComponent } from '@modules/user-role.component';
import { userGuard } from './core/guards/user.guard';
import { AdminRoleComponent } from '@modules/admin-role.component';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@modules/auth.module').then((m) => m.AuthModule),
      canActivate:[loginGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('@modules/landing.module').then((m) => m.LandingModule),
      // canActivate:[AuthGuard]
  },
  // {
  //   path: 'downloadTemplate',
  //   loadChildren: () =>
  //     import('@modules/fatora-templates.module').then((m) => m.FatoraTemplatesModule),
  //     // canActivate:[AuthGuard]
  // },

 
  {
    path: 'user',
    component:UserRoleComponent,
    loadChildren: () =>
      import('@modules/user-role.module').then((m) => m.UserRoleModule)
  },
  {
    path: 'admin',
    component:AdminRoleComponent,
    loadChildren: () =>
      import('@modules/admin-role.module').then((m) => m.AdminRoleModule),
      canActivate:[AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
