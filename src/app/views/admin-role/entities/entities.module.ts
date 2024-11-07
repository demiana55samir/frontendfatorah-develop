import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesComponent } from './entities.component';
import { EntitiesRoutingModule } from './enities.routing.module';
import { AllEntitiesComponent } from './all-entities/all-entities.component';
import { DeletedEntitiesComponent } from './deleted-entities/deleted-entities.component';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { AddEditEntityComponent } from './add-edit-entity/add-edit-entity.component';
import { SharedModule } from '@modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PrimNgModule } from 'app/core/shared/prim-ng.module'

@NgModule({
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PrimNgModule
  ],
  declarations: [
    EntitiesComponent,
    AllEntitiesComponent,
    DeletedEntitiesComponent,
    EntityDetailsComponent,
    AddEditEntityComponent
  ]
})
export class EntitiesModule { }
