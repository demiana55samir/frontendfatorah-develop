import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsComponent } from './blogs.component';
import { BlogsRoutingModule } from './blogs.routing.module';
import { AllBlogsComponent } from './all-blogs/all-blogs.component';
import { AddEditBlogComponent } from './add-edit-blog/add-edit-blog.component';
import { BlogsDetailsComponent } from './blogs-details/blogs-details.component';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  imports: [
    CommonModule,
    BlogsRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule,
    NgxDropzoneModule
  ],
  declarations: [
    AllBlogsComponent,
    BlogsComponent,
    AddEditBlogComponent,
    BlogsDetailsComponent
  ]
})
export class BlogsModule { }
