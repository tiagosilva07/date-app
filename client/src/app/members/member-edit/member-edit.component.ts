import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { Member } from 'src/models/member';
import { User } from 'src/models/user';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  member:Member;
  user: User;

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.userName).subscribe(member=>{
      this.member = member;
    })
  }
  updatemember(){
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastr.success('Profile Updated Successfully')
      this.editForm.reset(this.member);
    })
}

}
