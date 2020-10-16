import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injections-tokens';
import {Book} from '../models/book'

@Injectable({
  providedIn: 'root'
})
export class BookstoreService {

   private baseApiUrl = `${this.apiUrl}api/`
   private _bookList: Book[] = [];

   constructor(private http: HttpClient,@Inject(STORE_API_URL) private apiUrl: string)  { }

   getCatalog(): Observable<Book[]>{
     return this.http.get<Book[]>(`${this.baseApiUrl}books`)
   }

   getOrders(): Observable<Book[]>{
    return this.http.get<Book[]>(`${this.baseApiUrl}orders`)
  }

  makeOrder(obj: Book[]): Observable< Book[]>{
    return this.http.post< Book[]>(`${this.baseApiUrl}orders/purchase`,obj)
  }

  createList(obj: Book[]): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseApiUrl}orders/createlist`,obj)
  }

  // removeItem(obj: Book): Observable<Book>{
  //   return this.http.post<Book>(`${this.baseApiUrl}orders/deletebook`, obj)
  // }
  set bookList(books: Book[]){
   this._bookList = books;
  }

  get bookList(){
    return this._bookList;
  }
}
