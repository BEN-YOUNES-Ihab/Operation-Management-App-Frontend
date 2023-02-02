import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { DashboardComponent } from './dashboard.component'; 
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { NgxEchartsModule } from 'ngx-echarts';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { animation: 'dashboard' },
    canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    Ng2FlatpickrModule,
    ReactiveFormsModule,
    CoreCommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), 
    }),]
})
export class DashboardModule { }
