import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { BookstoreService } from 'src/app/services/bookstore.service';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';


export interface PeriodicElement {
  id: number;
  author: string;
  title: string;
  price: number;
}


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  
  forPurchase:Book [] = [];
  orders:Book[] = [];
  bookList:Book[] = [];
  display: boolean;
  showMsg: string;
  total : number;
  columns = ['select','id','author','title','price'];
  dataSource: any;
  selection = new SelectionModel<PeriodicElement>(true, []);
  constructor(private bs: BookstoreService) { }

  ngOnInit(): void {
    this.GetOrders();
  }

  GetOrders(){
    this.bs.getOrders().subscribe(res => {
      this.orders = res;
      if( this.orders && this.bs.bookList.length > 0){
        this.initializeData(this.bs.bookList);
      }else{
        this.bs.getCatalog().subscribe(res => {
          if(res){
           this.initializeData(res);
          }
        });
      }  
       
    })
  }
  
  initializeData(data: any){
     if(data && data.length > 0){
       this.total = 0.00;
      this.bs.bookList = data
      this.bookList = this.bs.bookList;
      this.bookList.forEach( select => select.select = false);
      this.dataSource = new MatTableDataSource<Book>(this.bookList);
     }
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  chooseRow(raw){
    this.display = false;
     if(this.forPurchase.some(i => i.id == raw.id)){
      raw.select = false;
      var removeIndex = this.forPurchase.map(function(item) { return item.id; }).indexOf(raw.id);
      this.forPurchase.splice(removeIndex, 1);
     }else{
      raw.select = true;
      this.forPurchase.push(raw);
     }
     this.countTotal( this.forPurchase)
  }

 countTotal(list){
  this.total = 0.00;
  this.forPurchase.forEach(element => {
        if(element.select){
          this.total += element.price; 
        }
     });
 }
  purchase(){
    if(this.forPurchase &&   this.forPurchase.length > 0){
      const obj : Book [] = [];
      this.forPurchase.forEach( x => {
        if(x.select == true)
        obj.push(x);
        x.select = false;
      })
      if(obj && obj.length > 0){
      this.bs.makeOrder(obj).subscribe(res => {
            
            if(res) {
              this.orders = res;
             
              this.showMsg = 'Purchase succeded!'
            }
            else{
              this.showMsg = 'Purchase failed!'
            }
            this.total = 0.00;
            this.display = true;
      })
    }
    }
  }

}
