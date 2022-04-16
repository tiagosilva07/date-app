import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  logedUser: User;

  constructor(public accountService: AccountService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountService.login(this.model).subscribe({
      next:(response)=>{
        this.toastrService.success('You are loged in successfully...we are redirecting you to the members page!');
        this.router.navigateByUrl('/members');
      },
      error: (error)=>{
        this.toastrService.error(error.error);
      }
    });
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
