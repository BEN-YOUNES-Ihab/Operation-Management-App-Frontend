import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { NgForm } from '@angular/forms';
import { French } from "flatpickr/dist/l10n/fr.js"
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/main/admin/users/services/users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar-event-sidebar',
  templateUrl: './calendar-event-sidebar.component.html',
  styleUrls: ['./calendar-event-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarEventSidebarComponent implements OnInit {
  
  @ViewChild('formDateRef') formDateRef;

  public categorySubmitted = false;
  public selectedEvent: Event;
  public eventsList: Event[];
  public selectedCategory: Category;
  public categorysList: Category[];
  public error: string = "";
  public isDataEmpty;
  public selectLabel = [
    { label: 'Revenue', bullet: 'success', cat:'Opérations' },
    { label: 'Dépense', bullet: 'danger' , cat:'Opérations'},
    { label: 'Avance', bullet: 'warning' , cat:'Opérations'},
    { label: 'Rappel', bullet: 'info', cat:'Autres' }
  ];
  public DateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    "locale": French,
    enableTime: true,
  };


  constructor(
    private _coreSidebarService: CoreSidebarService,
    private modalService: NgbModal, 
    private eventService: EventService,
    private categoryService: CategoryService,
    private userService: UserService,
    private route: Router,
    private toastr: ToastrService,
    ) {}
    ConfirmTextOpen(_id: string) {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      })
      .then((result)=> {
        if (result.value) {
          this.deleteEvent(_id);
        }
      });
    }
  sucessToastr(message,title) {
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-left',
      toastClass: 'ngx-toastr myToast',
      closeButton: true
    });
  }
  errorToastr(message,title) {
    this.toastr.error(message, title, {
      positionClass: 'toast-bottom-left',
      toastClass: 'ngx-toastr myToast',
      closeButton: true
    });
  }
 
  clickAddCategory(modalBasic){
    this.categorySubmitted = false;
    this.error = "";
    this.modalService.open(modalBasic, {
      windowClass: 'modal',
      centered: true,
      size: 'sm'
    });
  }
  
  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }
  refreshEventsList() {
    this.eventService.getEventsList().subscribe(data=>{
      this.eventService.eventslistSubject$.next(data as Event[]);
      this.eventService.tempEvents = data as Event[];
     },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }else{
          console.error(err);
        }
      }
    }
    );
     this.eventService.getEventsListSubject().subscribe(res=>{
       this.eventsList = res as Event[];
     });
  }
  addEvent(eventForm) {
    if(eventForm.valid){
      eventForm.form.value.date = this.formDateRef.flatpickrElement.nativeElement.children[0].value;
      this.eventService.postEvent(eventForm.value).subscribe((res) => {
        this.sucessToastr("Evénement ajouté avec succès.","Bravo!")
        this.refreshEventsList();
        this.resetForm(eventForm);
        this.toggleEventSidebar();
      },(err)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.userService.logout();
            this.route.navigate(['pages/authentication/login-v2']);
          }
        }else{
          this.errorToastr("Veuillez réessayer.","Erreur!")
        }
      }
      );
    }
  }
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.selectedEvent = {
      _id: "",
      title: "",
      date:"",
      description: "",
      type:"",
      category:null,
      value: 0
    }
  }
  refreshCategorysList() {
    this.categoryService.getCategorysList().subscribe((res) => {
      this.categorysList = res as Category[];
    });
  }
  postCategoryDetails(form: NgForm){
    this.categorySubmitted = true;
    if(form.valid){
      for(let category of this.categorysList){
        if(category.name == form.value.name){
          this.error = "Cette catégorie existe déjà.";
          return;
        }
      }
      this.categoryService.postCategory(form.value).subscribe((res) => {
        this.refreshCategorysList();
        this.sucessToastr("Catégorie ajouté avec succès.","Bravo!")
        this.categorySubmitted = false;
        this.error="";
        let ref = document.getElementById('cancel');
        ref?.click();
      }
      ,(err)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.userService.logout();
            this.route.navigate(['pages/authentication/login-v2']);
          }
        }else{
          this.error = "Erreur!! Veuillez réessayer.";
        }
      }
      );
    }
  }

  
  updateEvent(eventForm: NgForm) {
    if(eventForm.invalid){
      return;
    }
    eventForm.form.value.date = this.formDateRef.flatpickrElement.nativeElement.children[0].value;
    
    this.eventService.putEvent(eventForm.value).subscribe((res) => {
      this.resetForm(eventForm);
      this.refreshEventsList();
      this.sucessToastr("Evénement mis à jour avec succès.","Bravo!")
      this.toggleEventSidebar();
  },(err)=>{
    if(err instanceof HttpErrorResponse){
      if(err.status === 401){
        this.userService.logout();
        this.route.navigate(['pages/authentication/login-v2']);
      }
    }else{
      this.errorToastr("Veuillez réessayer.","Erreur!")
    }
  }
  );

  }

 
  deleteEvent(_id: string) {
    // if (confirm('Voulez-vous vraiment supprimer cet événement?') == true) {
      this.eventService.deleteEvent(_id).subscribe((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Supprimé!',
          text: "L'événement a été supprimé.",
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
        this.refreshEventsList();
        this.toggleEventSidebar();
      },(err)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.userService.logout();
            this.route.navigate(['pages/authentication/login-v2']);
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: "Veuillez réessayer.",
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });        
        }
      }
      );
    // }
  }


  ngOnInit(): void {
    this.refreshCategorysList();
    this.eventService.getCurrentEventSubject().subscribe(response => {
      if (response) {
        this.selectedEvent = response;
        this.isDataEmpty = false;
        if (response._id === undefined) {
          this.isDataEmpty = true;
        }
      }
      else {
        this.selectedEvent = new Event();
         // Clear Flatpicker Values
         setTimeout(() => {
          this.formDateRef.flatpickr.clear();
        });
        this.isDataEmpty = true;
      }
    });
  }
  
}
