import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  readonly baseURL = 'http://localhost:3000/events';
  public eventslistSubject$: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>(null);
  public currenteventSubject$: BehaviorSubject<Event> = new BehaviorSubject<Event>(null);
  public calendarRef = [
    { id: 1, filter: 'Revenue', color: 'success', checked: true },
    { id: 2, filter: 'Dépense', color: 'danger', checked: true },
    { id: 3, filter: 'Avance', color: 'warning', checked: true },
    { id: 4, filter: 'Rappel', color: 'info', checked: true }
  ];
  public calendar = [];
  public events = [];
  public tempEvents = [];
  public onCalendarChange: BehaviorSubject<any[]>;

  constructor(private http: HttpClient) { 
    this.onCalendarChange = new BehaviorSubject([]);
  }


  getCalendar(){
    this.calendar = this.calendarRef;
    this.onCalendarChange.next(this.calendar); 
  }
  getonCalendarChangeSubject():Observable<any> {
    return this.onCalendarChange.asObservable();
  }

  calendarUpdate(calendars) {
    const calendarsChecked = calendars.filter(calendar => {
      return calendar.checked === true;
    });

    let calendarRef = [];
    calendarsChecked.map(res => {
      calendarRef.push(res.filter);
    });
    // console.log(calendarRef);
    // console.log(this.tempEvents);
    let filteredCalendar = this.tempEvents.filter(event => calendarRef.includes(event.type));
    // console.log(filteredCalendar);
    this.events = filteredCalendar;
    this.eventslistSubject$.next(this.events);
  }

  getCurrentEventSubject():Observable<Event> {
    return this.currenteventSubject$.asObservable();
  }
  getEventsListSubject():Observable<Event[]> {
    return this.eventslistSubject$.asObservable();
  }
  getEvent(_id: string){
    return this.http.get(this.baseURL+ `/${_id}`);
  }
  postEvent(event: Event) {
    return this.http.post(this.baseURL, event);
  }

  getEventsList() {
    return this.http.get(this.baseURL);
  }

  putEvent(event: Event) {
    return this.http.put(this.baseURL + `/${event._id}`, event);
  }

  deleteEvent(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}