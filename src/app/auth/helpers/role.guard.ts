import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from 'app/main/admin/users/services/users.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private route:Router, private userService: UserService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.userService.GetRole()=='Admin'){
      return true;
    }
    else{
      alert("Vous n'êtes pas autorisé à accéder cette page");
      this.route.navigateByUrl("pages/authentication/login-v2");
      this.userService.logout();
      return false;
    }
  }
  
}