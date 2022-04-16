import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountService.login(this.model).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  logout(){
    this.accountService.logout();
  }
}
