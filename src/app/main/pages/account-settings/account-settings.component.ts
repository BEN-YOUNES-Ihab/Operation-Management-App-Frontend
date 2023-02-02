import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/main/admin/users/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'app/main/admin/users/models/user.model';
import { French } from "flatpickr/dist/l10n/fr.js"
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit {
  public currentUser: User;
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public accountSettingsForm: FormGroup;
  public changePasswordForm: FormGroup;
  public submitted = false;
  public passwordSubmitted = false;
  public error: string = "";
  public passError: string = "";

  public basicDateOptions = {
    altInput: true,
    "locale": French,
  }

  constructor(
    public userService: UserService,
    private toastr: ToastrService,
    private _formBuilder : FormBuilder,
    private route: Router) {}

  ngOnInit(): void {
    this.userService.getUser(localStorage.getItem("id")).subscribe((res) => {
      this.currentUser = res as User;
      this.accountSettingsForm = this._formBuilder.group({
        _id: [this.currentUser._id, [Validators.required]],
        name: [this.currentUser.name, [Validators.required]],
        lastname: [this.currentUser.lastname, [Validators.required]],
        birthday: [this.currentUser.birthday, [Validators.required]],
        email: [this.currentUser.email, [Validators.required, Validators.email]],
        recievesNotifications: [this.currentUser.recievesNotifications, Validators.required],
        role: [this.currentUser.role, Validators.required]
      });
      this.changePasswordForm = this._formBuilder.group({
        _id: [this.currentUser._id, [Validators.required]],
        oldpassword: ['', [Validators.required]],
        password: ['', [Validators.required]],
        repeatpassword: ['', [Validators.required]]
      });
    });
  }
  get f() {
    return this.accountSettingsForm.controls;
  }
  get e() {
    return this.changePasswordForm.controls;
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

  refreshUser() {
    this.userService.getUser(localStorage.getItem('id')).subscribe((res) => {
      this.userService.selectedUser = res as User;
    });
  }
  
  updateCurrentUserDetails(form: FormGroup){
    this.submitted = true;
    if (this.accountSettingsForm.invalid) {
      return;
    }
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    })
    .then((result)=> {
      if (result.value) {
        this.userService.putUser(form.value).subscribe((res) => {
        this.userService.userSubject$.next(form.value);
        this.error = "";
        this.refreshUser();
        },
        err=>{
          if(err instanceof HttpErrorResponse){
            if(err.status === 404){
              Swal.fire({
                icon: 'error',
                title: 'Pas de changement effectué.',
                customClass: {
                  confirmButton: 'btn btn-primary'
                }
              });
            }
          }else{
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur!! veuillez réessayer!',
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            });
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Utilisateur modifié!',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    });
} 

updateCurrentUserPassword(form: FormGroup){
  this.passwordSubmitted = true;
  if (this.changePasswordForm.invalid) {
    return;
  }
  this.userService.compareUserPassword(form.value).subscribe((res) => {
    this.passwordSubmitted = false;
    if(form.value.password==form.value.repeatpassword){
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText: 'Enregistrer',
        cancelButtonText: 'Annuler',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      })
      .then((result)=> {
        if (result.value) {
          this.userService.putUserPassword(form.value).subscribe((data) => { 
            this.passError="";
            let ref = document.getElementById('_cancel')
            ref?.click();
          },
          (err)=>{
            if(err instanceof HttpErrorResponse){
              if(err.status === 401){
                this.userService.logout();
                this.route.navigate(['pages/authentication/login-v2']);
              } 
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Erreur! Veuillez réessayer.',
                customClass: {
                  confirmButton: 'btn btn-primary'
                }
              });
              console.error(err);
            } 
          }); 
          Swal.fire({
            icon: 'success',
            title: 'Mot de passe modifié!',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }
      });
    }else{
      this.passError = "Confirmer votre mot de passe."
    }
  },
  err=>{
    this.passError = "Mot de passe actuel pas correct.";
  });         
} 


   togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

}
