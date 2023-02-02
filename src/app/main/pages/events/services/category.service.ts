import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly baseURL = 'http://localhost:3000/categorys';

  constructor(private http: HttpClient) { }

  postCategory(cat: Category) {
    return this.http.post(this.baseURL, cat);
  }

  getCategorysList() {
    return this.http.get(this.baseURL);
  }

  putCategory(cat: Category) {
    return this.http.put(this.baseURL + `/${cat._id}`, cat);
  }

  deleteCategory(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}