import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get('https://dummyjson.com/products', {headers: this.httpHeaders});
  }
  getProductById(id: number) {
    return this.http.get(`https://dummyjson.com/products/${id}`, {headers: this.httpHeaders});
  }
}
