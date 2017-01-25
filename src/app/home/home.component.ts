import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  localStorage: CoolLocalStorage;
  constructor(private authService : AuthService,  private router: Router, localStorage: CoolLocalStorage) 
  { 
    this.localStorage = localStorage;  
  }
  userData:any;
  role:string='';
  homePage:boolean = true;
  aboutPage:boolean = false;
  contactPage:boolean = false;

  activateHome()
  {
    this.homePage = true;
    this.aboutPage = false;
    this.contactPage = false;
  }
  activateAbout()
  {
    this.homePage = false;
    this.aboutPage = true;
    this.contactPage = false;
  }
  activateContact()
  {
    this.homePage = false;
    this.aboutPage = false;
    this.contactPage = true;
  }

  ngOnInit() {
    this.role = this.localStorage.getItem('role');
    if(this.role == 'admin')
    {
      this.authService.getUsers().subscribe(
        data => this.getUsersSuccess(data),
        err => this.getUsersFailed(err)
      );
    }
    else if(this.role == 'member')
    {

    }
    else
    {
      this.router.navigate(['login']);
    }

    
  }

  getUsersSuccess(data)
  {
    this.userData = data;
  }

  getUsersFailed(err)
  {
    console.log(err);
  }

  logout()
  {
    this.localStorage.clear();
    this.router.navigate(['login']);
  }

}
