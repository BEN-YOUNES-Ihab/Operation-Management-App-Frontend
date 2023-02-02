import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';

import { UsersComponent } from './users.component'; 
import { RoleGuard } from 'app/auth/helpers/role.guard';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// routing
const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    data: { animation: 'users' },
    canActivate: [RoleGuard]
  }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, SweetAlert2Module.forRoot(), RouterModule.forChild(routes),Ng2FlatpickrModule,NgxDatatableModule, NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule]
  
})
export class UsersModule { }
