import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SampleComponent } from './sample.component';
import { HomeComponent } from './home.component';
import { ChatComponent } from './chat/chat.component';
import { SampleBodyContentComponent } from './sample-body-content/sample-body-content.component';

const routes = [
  {
    path: 'sample',
    component: SampleComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [SampleComponent, HomeComponent, ChatComponent, SampleBodyContentComponent],
  imports: [RouterModule.forChild(routes),PerfectScrollbarModule,DragDropModule, ContentHeaderModule, TranslateModule, CoreCommonModule],
  exports: [SampleComponent, HomeComponent]
})
export class SampleModule {}
