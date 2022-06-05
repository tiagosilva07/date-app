import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate = 'liked';
  pagedNumber= 1;
  pageSize = 5;
  pagination: Pagination;
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate, this.pagedNumber, this.pageSize).subscribe({
      next: (response) =>{
        response =>
        this.members = response.result;
        this.pagination = response.pagination;
      },
    });
  }
  pagedChange(event: any){
    this.pagedNumber = event.page;
    this.loadLikes();
  }
}
