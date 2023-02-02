import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Contractor } from '../models/contractor.model';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  readonly baseURL = 'http://localhost:3000/contractors';

  constructor(private http: HttpClient) { }

  postContractor(art: Contractor) {
    return this.http.post(this.baseURL, art);
  }

  getContractorsList() {
    return this.http.get(this.baseURL);
  }

  putContractor(art: Contractor) {
    return this.http.put(this.baseURL + `/${art._id}`, art);
  }

  deleteContractor(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}