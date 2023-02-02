import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';
import { EventsComponent } from './events.component';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { AuthGuard } from 'app/auth/helpers/auth.guards';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreSidebarModule } from '@core/components';
import { CalendarEventSidebarComponent } from './calendar-event-sidebar/calendar-event-sidebar.component';
import { CalendarMainSidebarComponent } from './calendar-main-sidebar/calendar-main-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);
// routing
const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent,
    data: { animation: 'events' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [EventsComponent, CalendarEventSidebarComponent, CalendarMainSidebarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardSnippetModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    FullCalendarModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    CoreSidebarModule,
    SweetAlert2Module
    ],
    providers: [],
    bootstrap: [EventsComponent]
})
export class EventsModule { }
