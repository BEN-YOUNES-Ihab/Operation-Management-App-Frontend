import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { RoleGuard } from 'app/auth/helpers/role.guard';
import { InvitesComponent } from './invites.component';
// routing
const routes: Routes = [
  {
    path: 'invites',
    component: InvitesComponent,
    data: { animation: 'invites' },
    canActivate: [RoleGuard]
  }
];

@NgModule({
  declarations: [InvitesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule]
  
})
export class InvitesModule { }
