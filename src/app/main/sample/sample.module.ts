import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SampleComponent } from './sample.component';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { AuthGuard } from 'app/auth/helpers/auth.guards';

const routes = [
  {
    path: 'sample',
    component: SampleComponent,
    data: { animation: 'sample' },
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [SampleComponent, HomeComponent],
  imports: [RouterModule.forChild(routes),
    PerfectScrollbarModule,
    DragDropModule,
    ContentHeaderModule,
    TranslateModule,
    CoreCommonModule,
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule],
  exports: [SampleComponent, HomeComponent]
})
export class SampleModule {}
