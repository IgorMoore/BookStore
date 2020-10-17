import { Component, OnInit } from '@angular/core';
import { Action, Book } from 'src/app/models/book';
import { BookstoreService } from 'src/app/services/bookstore.service';
import { FormGroup,FormBuilder, FormArray, FormControlName } from '@angular/forms';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  tableForm: FormGroup;
  display = false;
  msg: string;
  tempList:Book[] = [];
  books:Book[] = [];
  columns = ['id','author','title','price']
  constructor(private bs: BookstoreService, private formBuilder : FormBuilder) { }

 get booksArray() {
    return this.tableForm.get('books') as FormArray;
 }

 get formBookList(){
  return this.booksArray.controls;
}

  ngOnInit(): void {
     this.GetCatalog();
   
  }
  

  createObjectArr(): Book[]{
    let Books:Book[] = [];
    
    var b = new Book;
    for (let index = 0; index < this.formBookList.length; index++) {
      b.action = this.formBookList[index].value['action']
      b.author = this.formBookList[index].value['author']
      b.id = this.formBookList[index].value['id']
      b.select = this.formBookList[index].value['select']
      b.title = this.formBookList[index].value['title']
      Books.push(b);
      }
    return Books;
  }

  createObject(index): Book{
  
   
    var b = new Book;
      b.action = this.formBookList[index].value['action']
      b.author = this.formBookList[index].value['author']
      b.id = this.formBookList[index].value['id']
      b.select = this.formBookList[index].value['select']
      b.title = this.formBookList[index].value['title']
    return b;
  }

  GetCatalog(){
    this.bs.getCatalog().subscribe(res => {
      this.books = res;
      this.books.forEach(b => {
        b.tmpLine = false;
      })
      if(this.tempList && this.tempList.length > 0){
        this.books =  this.books.concat(this.tempList)
      }
      this.tableForm= this.formBuilder.group({
        books: this.formBuilder.array([])
    })
    this.setBooksForm();
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
      author:[book.author],
      title:[book.title], 
      price:[book.price],
      tmpLine:[book.tmpLine],
      action:[book.action]
    });
  }

 removeBook(index){
if( this.formBookList[index].value){
  this.formBookList[index].value['action'] = Action.remove;
  let obj : Book [] = [];
  if(!this.formBookList[index].value['tmpLine']){
    var tmp= this.createObject(index);
      for (let index = 0; index < this.formBookList.length; index++) {
        if( this.formBookList[index].value['tmpLine'] == true){
        var b = new Book;
        const p:number = +this.formBookList[index].value['price']
        b.action = this.formBookList[index].value['action']
        b.author = this.formBookList[index].value['author']
        b.id = this.formBookList[index].value['id']
        b.price = p
        b.select = this.formBookList[index].value['select']
        b.title = this.formBookList[index].value['title']
        b.tmpLine = this.formBookList[index].value['tmpLine']
       
        this.tempList.push(b);
       }
      }
   
    obj.push(tmp)
    this.bs.createList(obj).subscribe(res => {
      if(res){
         this.GetCatalog();
      }
    })
  }else{
      this.booksArray.controls.splice(index,1);
      this.books = [];
       for (let index = 0; index < this.formBookList.length; index++) {
        var b = new Book;
        const p:number = +this.formBookList[index].value['price'] //convert string to number
        b.action = this.formBookList[index].value['action']
        b.author = this.formBookList[index].value['author']
        b.id = this.formBookList[index].value['id']
        b.price = p
        b.select = this.formBookList[index].value['select']
        b.title = this.formBookList[index].value['title']
        this.books.push(b);
        }
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
   this.msg = ''
   var obj = this.books[this.books.length- 1];
   const newBook: Book = new Book();
   newBook.select = false,
   newBook.id = obj.id + 1,
   newBook.author ='',
   newBook.title = '',
   newBook.price = 0,
   newBook.action = Action.add
   newBook.tmpLine = true;
   this.books.push(newBook);
   this.booksArray.push(this.formBuilder.group(newBook));
   this.books = this.books.filter(function (obj) {
    return obj.action != Action.remove;
  })
}
  }

update(i){
     const upBook = new Book;
      for (let index = 0; index < this.formBookList.length; index++) {
       if(i === index) {
        const p:number = +this.formBookList[index].value['price'] //convert string to number
        upBook.id =  this.formBookList[index].value['id']
         upBook.action = Action.update,
         upBook.author = this.formBookList[index].value['author']
         upBook.title = this.formBookList[index].value['title']
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
      for (let index = 0; index < this.formBookList.length; index++) {
        if(this.formBookList[index].value['action'] == Action.add){
        var b = new Book;
        const p:number = +this.formBookList[index].value['price']
        b.action = this.formBookList[index].value['action']
        b.author = this.formBookList[index].value['author']
        b.id = this.formBookList[index].value['id']
        b.price = p
        b.select = this.formBookList[index].value['select']
        b.title = this.formBookList[index].value['title']
        obj.push(b);
      }
      }
      console.log(obj);
       if(obj){
        this.bs.createList(obj).subscribe(res => {
          if(res){
            this.formBookList.forEach(b => {
              b.value['tmpLine'] = false;
              b.value['action'] = Action.none;
            })
            this.chooseMsgToShow(5)
          }
        })
       }
       
  }
  }
}
