import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import 'hammerjs/hammer.js';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Logger } from 'angular2-logger/core';

import { UserService, Broadcaster } from 'sarlacc-angular-client';
import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';

import { Globals } from './globals';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent
  ],
  providers: [
    Logger,
    CookieService,
    Broadcaster,
    UserService,
    Globals
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
