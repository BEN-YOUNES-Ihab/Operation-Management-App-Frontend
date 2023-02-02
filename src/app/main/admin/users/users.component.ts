import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { UserService } from './services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { InviteService } from '../invites/services/invite.service';
import { Invite } from '../invites/models/invite.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class UsersComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  public tableRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;

  public usersList: User[];
  public selectedUser : User;
  private selectedInvite: Invite;

  public currentUser: User;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private route: Router,
    private inviteService: InviteService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getCurrentUser();
    this.resetForm();
    this.refreshUserList();
  }


  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.selectedUser = {
      _id: "",
      name: "",
      lastname: "",
      birthday: Date.now(),
      email: "",
      password:"",
      role: "",
      recievesNotifications: true
    }
  }
  ConfirmTextOpen(_id: string, email: string) {
    
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
        this.onDelete(_id,email);
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
  getCurrentUser(){
    this.userService.getUser(localStorage.getItem("id")).subscribe((res) => {
      this.currentUser = res as User;
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }
    });

  }
  refreshUserList() {
    this.userService.getUserList().subscribe((res) => {
      this.usersList = res as User[];
      this.tableRows = res;
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
  }


  onEdit(user: User, modalBasic) {
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    this.selectedUser = user;
    
  }
  deleteInvite(invEmail: string){
    this.inviteService.deleteInvite(invEmail).subscribe((res) => {
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        console.error('something went wrong');
      }
    });
}
  onDelete(_id: string, email: string) {
    this.userService.deleteUser(_id).subscribe((res) => {
      Swal.fire({
        icon: 'success',
        title: 'Supprimé!',
        text: "L'utilisateur a été supprimé.",
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
      this.refreshUserList();
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
          text: "Veuillez réessayer ultérieurement.",
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });
        console.error(err);
      }
    });
    this.deleteInvite(email);
  }
  
  updateUserDetails(form: NgForm){
    if(form.invalid){
      return;
    }
    this.userService.putUser(form.value).subscribe((res) => {
        this.resetForm();
        this.refreshUserList();
        this.sucessToastr('Utilisateur mis à jour avec succés.','Bravo!')     
        this.modalService.dismissAll();
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }else if(err.status === 404){
          this.errorToastr('Pas de changement effectué','Erreur!');
        }
      }else{
        this.errorToastr('Veuillez réessayer ultérieurement','Erreur!');
        console.error('something went wrong');
      }
    });
  } 
  /**
   * Search (filter)
   *
   * @param event
   */
   filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    //filter our data
    const temp = this.usersList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tableRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}