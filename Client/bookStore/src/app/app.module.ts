import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AUTH_API_URL, STORE_API_URL } from './app-injections-tokens';
import { environment } from 'src/environments/environment';
import {ACCESS_TOKEN_KEY} from './services/auth.service'
import { JwtModule } from '@auth0/angular-jwt';
import { BooksComponent } from './components/books/books.component';
import { ReactiveFormsModule } from '@angular/forms';


export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrdersComponent,
    BooksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    HttpClientModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,

    JwtModule.forRoot({
     config: {
       tokenGetter,
       allowedDomains : environment.tokenWhiteListedDomains
     }

    })
  ],
  providers: [
    {
      provide: AUTH_API_URL,
      useValue: environment.authApi
    },
    {
      provide: STORE_API_URL,
      useValue: environment.storeApi
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
