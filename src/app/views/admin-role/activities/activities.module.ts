import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities.component';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { DeletedActivitiesComponent } from './deleted-activities/deleted-activities.component';
import { AddEditActivityComponent } from './add-edit-activity/add-edit-activity.component';
import { ActivitiesRoutingModule } from './activities.routing.module';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module'
import { ActivityDetailsComponent } from './activity-details/activity-details.component';

@NgModule({
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    ActivitiesComponent,
    AllActivitiesComponent,
    DeletedActivitiesComponent,
    ActivityDetailsComponent,
    AddEditActivityComponent
  ]
})
export class ActivitiesModule { }
