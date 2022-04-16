import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any ={};
  constructor(private accountService: AccountService, private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe({
      next:(response)=>{
        this.toastrService.success('You register successfuly...redirecting you to home page!');
        this.cancel();
      },
      error:(error)=>{
        this.toastrService.error(error.error);
      }
    });

  }

  cancel(){
   this.cancelRegister.emit(false);
  }

}
