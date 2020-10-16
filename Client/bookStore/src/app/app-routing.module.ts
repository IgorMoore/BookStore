import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './components/books/books.component';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '',component : HomeComponent},
  {path:'orders',component : OrdersComponent, canActivate: [AuthGuard]},
  {path:'books',component : BooksComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
