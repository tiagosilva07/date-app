import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/services/members.service';
import { Member } from 'src/models/member';

@Component({
  selector: 'app-members-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadmembers();
  }

  loadmembers(){
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    })
  }

}
