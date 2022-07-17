import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs',{static:true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions : NgxGalleryOptions[];
  galleryImages : NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;
  constructor(public presenceService: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService, private router: Router) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
  ngOnInit(): void {
    this.route.data.subscribe(data =>{this.member = data.member});
    this.route.queryParams.subscribe(params =>{
      params.tab ? this.selectTab(params.tab): this.selectTab(0);
    })
    this.galleryOptions = [
    {
      width:'500px',
      height:'500px',
      thumbnailsColumns:4,
      imagePercent: 100,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }
    ];

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      });
    }
    return imageUrls;
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.userName).subscribe({
      next:(messages) =>{
        this.messages = messages;
      }
    })
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading ==='Messages' && this.messages.length === 0){
      this.messageService.createHubConnection(this.user, this.member.userName);
    }else{
      this.messageService.stopHubConnection();
    }
  }
}
