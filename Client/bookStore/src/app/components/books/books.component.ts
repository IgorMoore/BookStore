import { Component, OnInit } from '@angular/core';
import { Action, Book } from 'src/app/models/book';
import { BookstoreService } from 'src/app/services/bookstore.service';
import { FormGroup, FormControl, Validators,FormBuilder, FormArray, FormControlName } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  tableForm: FormGroup;
  display = false;
  msg: string;
  originalList:Book[] = [];
  books:Book[] = [];
  columns = ['id','author','title','price']
  constructor(private bs: BookstoreService, private formBuilder : FormBuilder) { }

  get booksArray() {
    return this.tableForm.get('books') as FormArray;
 }



  ngOnInit(): void {
     this.GetCatalog();
   
  }
  

  GetCatalog(){
    this.bs.getCatalog().subscribe(res => {
      this.books = res;
      this.tableForm= this.formBuilder.group({
        books: this.formBuilder.array([])
    })
    this.setBooksForm();
    this.tableForm.get('books').valueChanges.subscribe(book => {
      console.log('book', book)});
    })
    
  }


  private setBooksForm(){
    const userCtrl = this.tableForm.get('books') as FormArray;
    this.books.forEach((book)=>{
      userCtrl.push(this.setBooksFormArray(book))
    })
  }

  private setBooksFormArray(book){
    return this.formBuilder.group({
      id:[book.id],
      author:[book.author,(Validators.required)],
      title:[book.title,(Validators.required)], 
      price:[book.price]
    });
  }

 removeBook(raw,index){
if(raw){
  raw[index].action = Action.remove;
  if(raw[index].author && raw[index].title){
    const obj : Book [] = [];
    const singleObj = new Book;
    singleObj.action = raw[index].action;
    singleObj.author = raw[index].author;
    singleObj.id = raw[index].id;
    singleObj.price = raw[index].price;
    singleObj.title = raw[index].title;
    obj.push(singleObj);
    this.bs.createList(obj).subscribe(res => {
      if(res){
        this.GetCatalog();
      }
    })
  }else{
    
      this.booksArray.controls.splice(index,1);
      this.books = this.books.filter(function (obj) {
              return obj.action != Action.remove;
          })
  
        }
      
        this.chooseMsgToShow(2)
    }
  }

  chooseMsgToShow(action: number){
    this.display = true;
    switch (action) {
      case 2:
        this.msg = 'Removed'
        break;
          case 3:
            this.msg = 'Updated'
            break;
            case 5:
              this.msg = 'New list created succesfully!'
              break;
     
    }
  }


  addBook(){
    if(this.booksArray.valid){
   var obj = this.books[this.books.length- 1];
   const newBook: Book = new Book();
   newBook.select = false,
   newBook.id = obj.id + 1,
   newBook.author ='',
   newBook.title = '',
   newBook.price = 0,
   newBook.action = Action.add
   
  this.books.push(newBook);
   this.booksArray.push(this.formBuilder.group(newBook));
   this.books = this.books.filter(function (obj) {
    return obj.action != Action.remove;
  })
 
}
  }

update(i){
     const upBook = new Book;
     var list = this.booksArray.controls;
      for (let index = 0; index < list.length; index++) {
       if(i === index) {
        const p:number = +list[index].value['price'] //convert string to number
        upBook.id =  list[index].value['id']
         upBook.action = Action.update,
         upBook.author = list[index].value['author']
         upBook.title = list[index].value['title']
         upBook.price = p
       }
        
      }
      const obj: Book[] = [];
      obj.push(upBook)
      this.bs.createList(obj).subscribe(res => {
        if(res){
          this.chooseMsgToShow(3)
        }
      })
}

  
  createList(){

    if(this.booksArray.valid){
    
      const obj:Book [] =  [];
      var bList = this.booksArray.controls
      for (let index = 0; index < bList.length; index++) {
        var b = new Book;
        const p:number = +bList[index].value['price'] //convert string to number
        b.action = bList[index].value['action']
        b.author = bList[index].value['author']
        b.id = bList[index].value['id']
        b.price = p
        b.select = bList[index].value['select']
        b.title = bList[index].value['title']
        obj.push(b);
        
      }
      console.log(obj);
       if(obj){
        this.bs.createList(obj).subscribe(res => {
          if(res){
            this.chooseMsgToShow(5)
          }
        })
       }
       
  }
  }
}
