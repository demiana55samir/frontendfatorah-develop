import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBlogsComponent } from './all-blogs/all-blogs.component';


import { adminGuard } from 'app/core/guards/admin.guard';
import { AddEditBlogComponent } from './add-edit-blog/add-edit-blog.component';
import { BlogsDetailsComponent } from './blogs-details/blogs-details.component';
import { AdminSupportGuard } from 'app/core/guards/admin_support.guard';



const routes: Routes = [
    { path: '', redirectTo: 'All-users', pathMatch: 'full' },
    { path: 'All-blogs', component: AllBlogsComponent ,canActivate:[adminGuard], data: { permissionKey: 'blogs.manage' }},
    { path: 'blog-details/:type/:id', component: AddEditBlogComponent ,canActivate:[adminGuard], data: { permissionKey: 'blogs.manage' }},
    { path: 'blog-details-view/:id', component: BlogsDetailsComponent ,canActivate:[adminGuard], data: { permissionKey: 'blogs.manage' }},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogsRoutingModule {}
