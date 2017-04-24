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

  stompClient: any;
  sensorData: any[] = [];
  sensorValues: number[] = [0,0,0,0,0,0,0,0,0,0];
  timestamps: string[] = ['','','','','','','','','',''];

  public lineChartData:Array<any> = [
    {data: this.sensorValues, label: 'Series A'}
  ];
  public lineChartLabels:Array<any> = this.timestamps;
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';


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
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame:any) => {
        console.log('Connected: ' + frame);
        this.subscribe();
    });

  }

  subscribe():void {
    this.stompClient.subscribe('/topic/sensor', (res:any) => {
        let data = JSON.parse(res.body);
        //console.log(data);
        this.sensorData.push(data);

        this.addDataToEndOfArray(this.timestamps,this.formatDate(new Date(data.timestamp)));
        this.addDataToEndOfArray(this.sensorValues,data.sensorValue);

        this.lineChartData = [
          {data: this.sensorValues, label: 'Series A'}
        ];

        this.lineChartLabels = this.sensorValues;

    });
  }

  private addDataToEndOfArray(arr:any[],value:any):void {
    arr = arr.reverse();
    arr.pop();
    arr = arr.reverse();
    arr.push(value);
  }

  private formatDate(d:Date):string {
    var hours = d.getHours().toString().length === 1 ? '0' + d.getHours().toString() : d.getHours().toString();
    var minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes().toString() : d.getMinutes().toString();
    var seconds = d.getSeconds().toString().length === 1 ? '0' + d.getSeconds().toString() : d.getSeconds().toString();

    var millis = d.getMilliseconds().toString().length === 1 ? '00' + d.getMilliseconds().toString() : d.getMilliseconds().toString();
    millis = d.getMilliseconds().toString().length === 2 ? '0' + d.getMilliseconds().toString() : millis;

    return hours + ':' + minutes + ':' + seconds + '.' + millis;
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