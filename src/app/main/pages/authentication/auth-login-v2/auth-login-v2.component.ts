import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { UserService } from 'app/main/admin/users/services/users.service';
import { User } from 'app/main/admin/users/models/user.model';

@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService
  ) {
    this._unsubscribeAll = new Subject();
    if (this.userService.isLoggedIn()) {
      this._router.navigate(['/']);
    }
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

  get f() {
    return this.loginForm.controls;
  }


  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }


  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  login(form: FormGroup){
    this.submitted = true;
    // stop here if form is invalid

    if (form.invalid) {
      return;
    }else{
      this.userService.login(form.value).subscribe(item =>{
      if(item!=null){
        this.userService.SaveTokens(item);
        localStorage.setItem('email', form.value.email);
        this.gettingRoleNow();
        this.loading = true;
        setTimeout(() => {
          this._router.navigate(['/']);
        }, 500);
      }
      },(err)=>{
        this.error = "L'identifiant ou le mot de passe est incorrect";
        this.loading = false;
      });
    }
}
gettingRoleNow(){
  this.userService.getUserList().subscribe((res) => {
    const users = res as User[];
    for(let i=0;i<users.length;i++){
      if(users[i].email== localStorage.getItem('email')){
        if(users[i].role){
          localStorage.setItem('role', users[i].role);
        }
        localStorage.setItem('id', users[i]._id);
      } 
    }
  });
}
loginIsValid(email :any, dataemail:any): boolean {
  if(email === dataemail){
    return true;
  }else{
    return false;
  }
}


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

