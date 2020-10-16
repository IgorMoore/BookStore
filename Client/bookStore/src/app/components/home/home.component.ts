import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { BookstoreService } from 'src/app/services/bookstore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   books:Book[] = [];
   columns = ['id','author','title','price']

  constructor(private bs: BookstoreService) { }

  ngOnInit(): void {

      this.bs.getCatalog().subscribe(res => {
        this.books = res;
        this.bs.bookList = res;
      })

  }

}
