import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DateApp';
  users : any;
  constructor( private http: HttpClient){  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUsers();
  }
  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (response)=>{
        this.users = response;
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }
}
