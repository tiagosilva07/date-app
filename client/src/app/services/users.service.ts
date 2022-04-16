import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: any ={};
  constructor(private http: HttpClient) { }

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
