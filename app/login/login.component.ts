import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginLoading = false;
  creds = {};
  user: User;

  private errorMessage = '';

  constructor(
    private userService: UserService,
    private broadcaster: Broadcaster,
    private router: Router
  ){}

  ngOnInit(): void {

    this.errorMessage = '';

    this.userService.returnUser()
    .then((user:User) => {
      this.user = user;
    }).catch((error:string) => {
      
    })
  }

  login(): void {
    event.preventDefault();
    this.loginLoading = true;
    this.errorMessage = '';

    this.userService.login(this.creds)
    .then((user:any) => {
      this.user = user;
      this.loginLoading = false;
      this.creds = {};
      let link = ['/'];
      this.router.navigate(link);
    }).catch((error:any) => {
      console.log(error);
      this.loginLoading = false;
      this.errorMessage = error;
    });
  }

  logout(): void {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')){
      this.userService.logout();
      this.user = null;
    }
  }
}