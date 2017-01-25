import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  localStorage: CoolLocalStorage;
  constructor(private authService : AuthService, private router: Router, localStorage: CoolLocalStorage) 
  { 
    this.localStorage = localStorage;   
  }
  registerForm:boolean = false;
  loginForm:boolean = true;

  failedMessage:string = '';

  //Register vars
  loginData:Object = 
  {
    username:'',
    password:''
  }

  //Login vars
  registerData:Object = 
  {
    username:'',
    password:''
  }

  toggleLogin()
  {
    if(this.loginForm) return;
    this.failedMessage = '';
    this.registerForm = false;
    this.loginForm = true;
  }

  toggleRegister()
  {
    if(this.registerForm) return;
    this.failedMessage = '';
    this.loginForm = false;
    this.registerForm = true;
  }

  loginUser()
  {
    console.log('log username ' + this.loginData['username']);
    console.log('log username ' + this.loginData['password']);
    this.authService.login(this.loginData).subscribe(
      data => this.loginSuccess(data),
      err => this.loginFailed(err)
    );
  }

  loginSuccess(data)
  {
    if(data['status'] == '0')
    {
      this.failedMessage = data['message'];
      console.log('Login failed ' + data['message']);
      return;
    }
    else
    { 
      this.localStorage.setItem('username', data['data']['username']);
      this.localStorage.setItem('role', data['data']['role']);
      this.router.navigate(['home']);
    }
  }

  loginFailed(err)
  {
      console.log('Error ' + err);
  }

  registerUser()
  {
    console.log('reg username ' + this.registerData['username']);
    console.log('reg username ' + this.registerData['password']);
    this.authService.register(this.registerData).subscribe(
      data => this.registerSuccess(data),
      err => this.registerFailed(err)
    );
  }

  registerSuccess(data)
  {
    if(data['status'] == '0')
    {
      console.log('Register failed ' + data['message']);
      this.failedMessage = data['message'];
      return;
    }
    else
    { 
      this.localStorage.setItem('username', data['data']['username']);
      this.localStorage.setItem('role', data['data']['role']);
      this.router.navigate(['home']);
    }
  }

  registerFailed(err)
  {
      console.log('Error ' + err);
  }


  ngOnInit() {
    var username = this.localStorage.getItem('username');
    var role = this.localStorage.getItem('role');
    if(username == '' || username == undefined || role == '' || role == undefined)
    {
      this.localStorage.clear();
    }
    else
    {
      this.router.navigate(['home']);
    }
  }

}
