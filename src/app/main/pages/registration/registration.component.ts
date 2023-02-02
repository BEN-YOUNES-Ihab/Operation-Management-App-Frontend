import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { NgForm } from '@angular/forms';
import { French } from "flatpickr/dist/l10n/fr.js"

import { UserService } from 'app/main/admin/users/services/users.service';
import { InviteService } from 'app/main/admin/invites/services/invite.service';
import { Invite } from 'app/main/admin/invites/models/invite.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FlatpickrOptions } from 'ng2-flatpickr';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {

  public invites: Invite[];
  public selectedInvite: Invite;
  public coreConfig: any;
  public passwordTextType: boolean;
  public repeatpasswordTextType: boolean;
  public error: string ="";
  public loading = false;
  public basicDateOptions: FlatpickrOptions = {
    altInput: true,
    "locale": French,
  }
  public email;
  public role;
  
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _activatedroute: ActivatedRoute,
    private _router: Router,
    private userService: UserService,
    private inviteService: InviteService
  ) {
    this._unsubscribeAll = new Subject();
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }
  
  ngOnInit(): void {
        // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  
    this.email = this._activatedroute.snapshot.params['email'];
    this.role = this._activatedroute.snapshot.params['role'];
    this.verifyValidInvite(this.email, this.role);    
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  verifyValidInvite(email, role){
    this.inviteService.getInvite(email).subscribe((res) => {
      this.selectedInvite = res as Invite;
      if(this.selectedInvite == null || this.selectedInvite.isactive == false || this.selectedInvite.role != role){
        this._router.navigate(['/pages/miscellaneous/error']);
      }
    }),(err)=>{
        console.error(err);
    }
  }


  updateInvite(inv: Invite){
    this.inviteService.updateInvite(inv).subscribe((res) => {
    },
    err=>{
      console.error(err);
    });
  }
  signUp(form: NgForm){
    if(form.invalid){
      return;
    }
    if(this.passwordIsValid(form.value.password, form.value.repeatpassword)){
      this.inviteService.getInvite(this.email).subscribe((res) => {
        this.selectedInvite = res as Invite;
        this.updateInvite(this.selectedInvite);
        this.userService.postUser(form.value).subscribe((res) => {
        this.loading = true;
        setTimeout(() => {
          this._router.navigate(['/pages/authentication/login-v2']);
        }, 1000);
      }),(err)=>{
        this.error = "Erreur";
        console.error(err);
      }
      },
      err=>{
        this.error = "Erreur";
        console.error(err);
      });
    }else{
      this.error = "Les mots de passe sont pas identiques";
    }
    
  }
  passwordIsValid(password :any, repaeatpassword : any): boolean {
    if(password==repaeatpassword){
      return true;
    }else{
      return false;
    }
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  toggleRepeatPasswordTextType() {
    this.repeatpasswordTextType = !this.repeatpasswordTextType;
  }
}
