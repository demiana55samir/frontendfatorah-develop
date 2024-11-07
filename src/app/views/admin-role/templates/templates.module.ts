import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { AllTemplatesComponent } from './all-templates/all-templates.component';
import { TemplatesRoutingModule } from './templates.routing.module';
import { AddEditTemplateComponent } from './add-edit-template/add-edit-template.component';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { PrimNgModule } from 'app/core/shared/prim-ng.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TemplatesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule,
    NgxDropzoneModule

  ],
  declarations: [
    TemplatesComponent,
    AllTemplatesComponent,
    AddEditTemplateComponent
  ]
})
export class TemplatesModule { }
