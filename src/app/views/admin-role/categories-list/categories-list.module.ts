import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListComponent } from './categories-list.component';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { CategoriesListRoutingModule } from './categories-list.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { DurationsListComponent } from './durations-list/durations-list.component';
import { AddEditDurationComponent } from './add-edit-duration/add-edit-duration.component';

@NgModule({
  imports: [
    CommonModule,
    CategoriesListRoutingModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PrimNgModule
  ],
  declarations: [
    CategoriesListComponent,
    AllCategoriesComponent,
    AddEditCategoryComponent,
    DurationsListComponent,
    AddEditDurationComponent
  ]
})
export class CategoriesListModule { }
