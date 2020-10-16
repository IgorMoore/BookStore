import { Component } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public get isLoggedIn(): boolean {
    return this.as.isAuthenticated()
  }

 user: string;
 showHistory: boolean;
 showErr: boolean;
 showErrMsg: string = 'required';
 form: FormGroup;
  constructor(private as: AuthService, private fb: FormBuilder){
    if(!this.user){
      var storage = localStorage.getItem('user_access_type');
      if(storage){
        this.user = storage;
      }
    }
    this.createForm();
  }


  createForm() {
    this.form = this.fb.group({
       email: ['', Validators.required],
       password: ['', Validators.required]
    },
     {updateOn: 'blur'}
    );
  
  }
  get email(){
    return this.form.controls['email'];
  }

  get password(){
    return this.form.controls['password'];
  }
  check(){
    this.showErr  = this.form.status == 'INVALID' ? true : false;
  }

  login(email: string, password: string){
    if(this.form.valid){
    this.as.login(email,password).subscribe(res => {
      this.showHistory =  res.user[0] == '0' ? true : false;
         this.user = res.user[0];
    }, error => {
     alert('Wrong ogin or password');
    })
  }
  }

  logout(){
    this.as.logout();
  }
}


