import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { DomainsComponent } from './domains.component';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// routing
const routes: Routes = [
  {
    path: 'domains',
    component: DomainsComponent,
    data: { animation: 'domains' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [DomainsComponent],
  imports: [
    SweetAlert2Module,
    CommonModule,
    NgxDatatableModule, 
    Ng2FlatpickrModule,
    NgSelectModule,
    RouterModule.forChild(routes),CardSnippetModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule
  ]  
})
export class DomainsModule { }
