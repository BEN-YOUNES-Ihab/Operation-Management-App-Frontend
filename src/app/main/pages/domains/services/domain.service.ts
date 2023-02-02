import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Domain } from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  readonly baseURL = 'http://localhost:3000/domains';

  constructor(private http: HttpClient) { }

  postDomain(domain: Domain) {
    return this.http.post(this.baseURL, domain);
  }

  getDomainList() {
    return this.http.get(this.baseURL);
  }

  putDomain(domain: Domain) {
    return this.http.put(this.baseURL + `/${domain._id}`, domain);
  }

  deleteDomain(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}