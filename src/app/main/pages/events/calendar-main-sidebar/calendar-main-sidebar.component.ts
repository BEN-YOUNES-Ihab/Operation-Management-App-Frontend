import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-calendar-main-sidebar',
  templateUrl: './calendar-main-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CalendarMainSidebarComponent implements OnInit {

  public eventsList: Event[];
  public checkAll = true;
  public calendarRef = []

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CalendarService} _calendarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private eventService: EventService) {}


  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }


  AddEvent() {
    let event = new Event();
    event.type = "";
    this.eventService.currenteventSubject$.next(event);
    this.toggleEventSidebar();
  }

 
  allChecked() {
    return this.calendarRef.every(v => v.checked === true);
  }


  checkboxChange(event, id) {
    const index = this.calendarRef.findIndex(r => {
      if (r.id === id) {
        return id;
      }
    });
    this.calendarRef[index].checked = event.target.checked;
    this.eventService.calendarUpdate(this.calendarRef);
    this.checkAll = this.allChecked();
  }


  toggleCheckboxAll(event) {
    this.checkAll = event.target.checked;
    if (this.checkAll) {
      this.calendarRef.map(res => {
        res.checked = true;
      });
    } else {
      this.calendarRef.map(res => {
        res.checked = false;
      });
    }
    this.eventService.calendarUpdate(this.calendarRef);
  }
  
  ngOnInit(): void {
    this.eventService.getCalendar();
    this.eventService.onCalendarChange.subscribe(res => {
       this.calendarRef = res;
    });
  }
}
