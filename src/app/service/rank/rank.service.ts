import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SudoService } from '../sudo/sudo.service';
import { UserBack } from '../../datas/data-types';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''
  })
};
@Injectable({
  providedIn: 'root'
})
export class RankService {

  RankShow = {
    nav: 'starter',
    ready: false,
    dataReady: false
  }
  sudoData: any
  // urlHost = 'http://47.92.132.100:603/sdkdb/'
  urlHost = 'http://localhost:603/sdkdb/'

  constructor(
    private http: HttpClient,
    private sudoService: SudoService,
  ) {
    this.sudoData = this.sudoService.SudoData
  }

  getRankData(sortName: string, userid: string) {
    const url = this.urlHost + 'find'
    const postData = {
      name: sortName,
      id: userid
    }
    return this.http.post(url, { data: postData }, httpOptions)
  }

  createRank(userName: string) {
    const url = this.urlHost + 'create'
    const postData = {
      name: userName,
      starterTime: this.sudoData.allStars[0].totalTime,
      starterStar: this.sudoData.allStars[0].starNum,
      starterLevel: this.sudoData.mode[0],
      normalTime: this.sudoData.allStars[1].totalTime,
      normalStar: this.sudoData.allStars[2].starNum,
      normalLevel: this.sudoData.mode[1],
      masterTime: this.sudoData.allStars[2].totalTime,
      masterStar: this.sudoData.allStars[2].starNum,
      masterLevel: this.sudoData.mode[2],
    }
    return this.http.post<UserBack>(url, { data: postData }, httpOptions)
  }
}
