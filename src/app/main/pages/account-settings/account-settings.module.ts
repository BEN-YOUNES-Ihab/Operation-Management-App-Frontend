import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';

import { AccountSettingsComponent } from './account-settings.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
const routes: Routes = [
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    data: { animation: 'account-seetings' },
    canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [AccountSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2FlatpickrModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule
  ],
  bootstrap: [AccountSettingsComponent]
})
export class AccountSettingsModule { }
