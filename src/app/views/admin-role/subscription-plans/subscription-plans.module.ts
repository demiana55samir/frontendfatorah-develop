import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPlansComponent } from './subscription-plans.component';
import { SubscriptionPlansRoutingModule } from './subscription-plans.routing.module';
import { AllPlansComponent } from './all-plans/all-plans.component';
import { AddEditPlanComponent } from './add-edit-plan/add-edit-plan.component';
import { GeneralPlanDetailsComponent } from './general-plan-details/general-plan-details.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { AddFeatureComponent } from './add-feature/add-feature.component';
import { FeaturesListComponent } from './features-list/features-list.component';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module';
import { DurationsListComponent } from './durations-list/durations-list.component';
import { EditDurationComponent } from './edit-duration/edit-duration.component';

@NgModule({
  imports: [
    CommonModule,
    SubscriptionPlansRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    SubscriptionPlansComponent,
    AllPlansComponent,
    AddEditPlanComponent,
    GeneralPlanDetailsComponent,
    PlanDetailsComponent,
    FeaturesListComponent,
    AddFeatureComponent,
    DurationsListComponent,
    EditDurationComponent
  ]
})
export class SubscriptionPlansModule { }
