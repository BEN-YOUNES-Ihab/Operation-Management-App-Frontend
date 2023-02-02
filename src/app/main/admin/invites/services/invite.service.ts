import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Invite } from '../models/invite.model';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  
  readonly baseURL = 'http://localhost:3000/send_email';

  constructor(private http: HttpClient) { }


  getInvitesList() {
    return this.http.get(this.baseURL);
  }
  postInvite(inviteForm: any) {
    return this.http.post(this.baseURL, inviteForm);
  }

  deleteInvite(email: string) {
    return this.http.delete(this.baseURL + `/${email}`);
  }
  getInvite(email:string) {
    return this.http.get(this.baseURL  + `/${email}`);
  }
  updateInvite(inv:Invite){
    return this.http.put(this.baseURL + `/${inv.email}`, inv);

  }
}

