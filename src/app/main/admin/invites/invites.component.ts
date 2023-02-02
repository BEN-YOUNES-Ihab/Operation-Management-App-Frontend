import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { InviteService } from './services/invite.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Invite } from './models/invite.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../users/services/users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvitesComponent implements OnInit {
  public invites: Invite[];
  public selectedInvite: Invite;
  public emailSubject: string = "Invitation à l'application DAF";
  public emailMessage: string = "Veuillez utiliser ce lien pour s'enregistrer à l'application DAF : http://localhost:4200/pages/registration/";
  public inviteSubmitted = false;
  constructor(
    private modalService: NgbModal,
    private inviteService: InviteService,
    private userService: UserService,
    private route: Router,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.refreshInviteList();
  }

  clicknewUser(modalBasic){
    this.inviteSubmitted = false;
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
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

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.selectedInvite = {
      _id: "",
      email: "",
      isactive: true,
      role:""
    }
  }

  postEmail(form: NgForm){
    this.inviteSubmitted = true;
    if(form.invalid){
      return;
    }
    for(let invite of this.invites){
      if(invite.isactive == false && invite.email == form.value.to){
        this.errorToastr('Cet utilisateur existe déjà','Erreur!') ;      
        return;
      }else if(invite.isactive == true && invite.email == form.value.to){
        this.inviteService.deleteInvite(invite.email).subscribe((res)=>{
        })
      }
    }
    this.emailSubject = "Invitation à l'application DAF";
    this.inviteService.postInvite(form.value).subscribe((res) => {
      this.sucessToastr("E-mail envoyé avec succès","Bravo!");
      this.resetForm(form);
      this.refreshInviteList();
      this.inviteSubmitted = false;
      this.modalService.dismissAll();
    }
    ,(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        this.errorToastr('Veuillez réessayer ultérieurement','Erreur!');
      }
    });
  }


  refreshInviteList() {
    this.inviteService.getInvitesList().subscribe((res) => {
      this.invites = res as Invite[];
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        console.error(err);
      }
    });
  }


  onDelete(email: string) {
    if (confirm('Voulez-vous vraiment supprimer cette invitation ?') == true) {
      this.inviteService.deleteInvite(email).subscribe((res) => {
        this.sucessToastr('Invitation supprimé.','Bravo!')
        this.refreshInviteList();
      },(err)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.userService.logout();
            this.route.navigate(['pages/authentication/login-v2']);
          }
        }else{
          this.errorToastr('Veuillez réessayer ultérieurement','Erreur!')
        }
      });
    }
  }
  
}