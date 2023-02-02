import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/auth/service';
import { UserService } from 'app/main/admin/users/services/users.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}


  


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const currentUser = this._authenticationService.currentUserValue;
    // const isLoggedIn = currentUser && currentUser.token;
    // const isApiUrl = request.url.startsWith(environment.apiUrl);
    // if (isLoggedIn && isApiUrl) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${currentUser.token}`
    //     }
    //   });
    // }
    const token = this.userService.GetAccesToken();
    if(token !== null){
      let tokenizedReq = request.clone({
        setHeaders: {
              Authorization: `Bearer ${token}`
            }
      });
      return next.handle(tokenizedReq).pipe(
        catchError(error => {
          if(error.status === 401){
            this.userService.clearTokenExpired();
          }
          return throwError(error);
        })
      )
    }
    return next.handle(request);
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
}