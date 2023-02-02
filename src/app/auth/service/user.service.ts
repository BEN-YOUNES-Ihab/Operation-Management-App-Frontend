import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class UserService {

  constructor() {}


  GetRole() {
    return localStorage.getItem("role") || '';
  }
  isLoggedIn(){
    return localStorage.getItem('accessToken')!=null;
  }

}
