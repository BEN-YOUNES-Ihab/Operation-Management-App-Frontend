import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';
import { Event } from './models/event.model'
import { EventService } from './services/event.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/main/admin/users/services/users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EventsComponent implements OnInit, AfterViewInit {

  public slideoutShow = false;
  public eventsList = [];
  
  public calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    initialView: 'dayGridMonth',
    locale: 'fr',
    initialEvents: this.eventsList,
    weekends: true,
    editable: true,
    eventResizableFromStart: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick: this.handleUpdateEventClick.bind(this),
    eventClassNames: this.eventClass.bind(this),
    select: this.handleDateSelect.bind(this)
  };

  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private eventService: EventService,
    private userService: UserService,
    private route: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  refreshEventsList() {
    this.eventService.getEventsList().subscribe(data=>{
      this.eventService.tempEvents = data as Event[];
      this.eventService.eventslistSubject$.next(data as Event[]);
    }
    ,(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }
    }
    );
    this.eventService.getEventsListSubject().subscribe(res=>{
      this.calendarOptions.events = this.eventsList = res as Event[];
    });
  }
 
  eventClass(s) {
    const calendarsColor = {
      Revenue: 'success',
      Dépense: 'danger',
      Avance: 'warning',
      Rappel: 'info'
    };

    const colorName = calendarsColor[s.event._def.extendedProps.type];
    return `bg-light-${colorName}`;
  }

 
  handleUpdateEventClick(eventRef: EventClickArg) {
    this.eventService.getEvent(eventRef.event._def.extendedProps._id).subscribe(data =>{
      this.eventService.currenteventSubject$.next(data as Event);
    });
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();

  }


  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

 
  handleDateSelect(eventRef) {
    const newEvent = new Event();
    newEvent.date = eventRef.start;
    newEvent.type = "";
    this.eventService.currenteventSubject$.next(newEvent);
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      // ! If we have zoomIn route Transition then load calendar after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this.refreshEventsList();

        }, 450);
      } else {
        this.refreshEventsList();

      }
    });

  }

 
  ngAfterViewInit() {
    let _this = this;
    this.calendarOptions.customButtons = {
      sidebarToggle: {
        text: '',
        click() {
          _this.toggleSidebar('calendar-main-sidebar');
        }
      }
    };
  }
}
