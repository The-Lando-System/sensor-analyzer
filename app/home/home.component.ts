import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

declare var SockJS: any;
declare var Stomp: any;

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: []
})
export class HomeComponent implements OnInit {

  user: User;

  private homeLoading = false;

  constructor(
    private userSvc: UserService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.homeLoading = true;
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
      this.homeLoading = false;
    }).catch((res:any) => {
      console.log('User is not logged in');
      this.homeLoading = false;
    });

    this.listenForLogin();
    this.listenForLogout();

    this.listenForData();
  }

  

  listenForData(): void {

    var socket = new SockJS('http://localhost:8080/sensor-data-websocket');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame:any) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/sensor', (res:any) => {
            console.log(JSON.parse(res.body));
        });
    });

  }


  listenForLogin(): void {
   this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.userSvc.returnUser()
      .then((user:User) => {
        this.user = user;
        this.homeLoading = false;
      }).catch((res:any) => {
        console.log('User is not logged in');
        this.homeLoading = false;
      });
    });
  }

  listenForLogout(): void {
    this.broadcaster.on<string>(this.userSvc.LOGOUT_BCAST)
    .subscribe(message => {
      this.user = null;
    });
  }

}