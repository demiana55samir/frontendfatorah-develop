import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoleComponent } from './admin-role.component';
import { AdminRoleRoutingModule } from './admin-role.routing.module';
import { UsersModule } from './users/users.module';
import { LayoutModule } from '../layout/layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminControlBoardModule } from './admin-control-board/admin-control-board.module';
import { FatoraTemplatesModule } from '@modules/fatora-templates.module';




@NgModule({
  imports: [
    CommonModule,
    AdminRoleRoutingModule,
    LayoutModule,
    UsersModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FatoraTemplatesModule,
    AdminControlBoardModule
  ],
  declarations: [AdminRoleComponent]
})
export class AdminRoleModule { }
