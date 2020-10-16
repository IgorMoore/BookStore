import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API_URL } from '../app-injections-tokens';
import {JwtHelperService} from '@auth0/angular-jwt'
import { Router} from '@angular/router';
import {Token} from '@angular/compiler/src/ml_parser/lexer';
import {Tokens} from '../models/token'
import { tap } from 'rxjs/operators';


export const ACCESS_TOKEN_KEY = 'bookstore_access_token'
export const USER_ACCESS = 'user_access_type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(AUTH_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<Tokens>{
      return this.http.post<Tokens>(`${this.apiUrl}api/auth/login`, {
        email, password
      }).pipe(
        
        tap(token => {
          localStorage.setItem(ACCESS_TOKEN_KEY,token.access_token);
          localStorage.setItem(USER_ACCESS,token.user[0].toString());
        })
      )
  }

  isAuthenticated(): boolean {
     var token  = localStorage.getItem(ACCESS_TOKEN_KEY);
     return token && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void{
     localStorage.removeItem(ACCESS_TOKEN_KEY);
     this.router.navigate(['']);
  }

  
}


