import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User;
  users: User[];
  public userSubject$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  readonly updatePasswordURL = 'http://localhost:3000/users/password';
  readonly baseURL = 'http://localhost:3000/users';
  readonly loginURL = 'http://localhost:3000/users/login';
  readonly refreshToken = 'http://localhost:3000/refresh';
  tokenresp: any;

  constructor(private http: HttpClient, private router: Router) { }
 
  getUsersubject():Observable<User> {
   return this.userSubject$.asObservable();
  }
  postUser(user: User) {
    return this.http.post(this.baseURL, user);
  }
  putUserPassword(user: User) {
    return this.http.put(this.updatePasswordURL + `/${user._id}`, user);  
  }
  compareUserPassword(user: User){
    return this.http.post(this.updatePasswordURL+  `/${user._id}`, user);
  }
  getUserList() {
    return this.http.get(this.baseURL);
  }
  getUser(_id: string){
    return this.http.get(this.baseURL+ `/${_id}`);
  }

  putUser(user: User) {
    return this.http.put(this.baseURL + `/${user._id}`, user);  
  }
  
  deleteUser(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
  login(inputdata: any){
    return this.http.post(this.loginURL , inputdata);
  }

  isLoggedIn(){
    return localStorage.getItem('accessToken')!=null;
  }
  
  GetRole() {
    return localStorage.getItem("role") || '';
  }

  logout() {
    localStorage.clear();
  }
  GetAccesToken() {
    return localStorage.getItem("accessToken");
  }
  SaveTokens(tokendata: any) {
    localStorage.setItem('accessToken', tokendata.accessToken);
    localStorage.setItem('refreshToken', tokendata.refreshToken);
  }
  postRefreshToken() {
    return this.http.post(this.refreshToken, {withCredentials: true});
  }
  clearTokenExpired(): void{
    localStorage.clear();
    this.router.navigate(['pages/authentication/login-v2'])
  }
}
