import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeader } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl =  environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe( user =>{
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(userParams: UserParams){
    this.userParams = userParams;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams){
    var cachedResponse = this.memberCache.get(this.getUserQuery(userParams));
    if(cachedResponse){
      return of (cachedResponse);
    }
    let params = getPaginationHeader(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users',params, this.http).pipe(
      map( response=>{
        this.memberCache.set(this.getUserQuery(userParams),response);
        return response;
      })
    );
  }

  getUserQuery(userParams: UserParams){
    return Object.values(userParams).join('-');
  }

  getMember(username : string): Observable<Member>{
    const member = [...this.memberCache.values()]
    .reduce((arr, elem)=> arr.concat(elem.result),[])
    .find((member : Member) => member.userName === username);
    if(member)
    {
      return of (member);
    }
    return this.http.get<Member>(this.baseUrl+ 'users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl+'users',member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId:number){
    return this.http.put(this.baseUrl +'users/set-main-photo/'+photoId,{});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl +'users/delete-photo/'+photoId);
  }

  addLike(username: string){
    return this.http.post(this.baseUrl +'likes/'+username,{});
  }

  getLikes(predicate:string, pageNumber: number, pageSize: number){
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }


}
