import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
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
    nav: 'starterStar',
    ready: false,
    dataReady: false
  }
  sudoData: any
  urlHost = 'http://47.92.132.100:603/sdkdb/'
  // urlHost = 'http://localhost:603/sdkdb/'
  // urlHost = 'http://192.168.199.207:603/sdkdb/'

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
  }

  getRankData(sortName: string, userid: string) {
    const url = this.urlHost + 'find'
    const postData = {
      name: sortName,
      id: userid
    }
    return this.http.post(url, { data: postData }, httpOptions)
  }

  createRank(userName: string, sudoData) {
    const url = this.urlHost + 'create'
    console.log(sudoData)
    const postData = {
      name: userName,
      starterTime: sudoData.allStars[0].totalTime,
      starterStar: sudoData.allStars[0].starNum,
      starterLevel: sudoData.mode[0],
      normalTime: sudoData.allStars[1].totalTime,
      normalStar: sudoData.allStars[2].starNum,
      normalLevel: sudoData.mode[1],
      masterTime: sudoData.allStars[2].totalTime,
      masterStar: sudoData.allStars[2].starNum,
      masterLevel: sudoData.mode[2],
    }
    return this.http.post<UserBack>(url, { data: postData }, httpOptions)
  }

  sendToUpdateData(sudoData) {
    this.storage.get('sd-setting').then((setting) => {
      if (setting) {
        if (setting.sudo.userid !== '') {
          const url = this.urlHost + 'update'
          const postData = {
            userid: setting.sudo.userid,
            starterTime: sudoData.allStars[0].totalTime,
            starterStar: sudoData.allStars[0].starNum,
            starterLevel: sudoData.mode[0],
            normalTime: sudoData.allStars[1].totalTime,
            normalStar: sudoData.allStars[2].starNum,
            normalLevel: sudoData.mode[1],
            masterTime: sudoData.allStars[2].totalTime,
            masterStar: sudoData.allStars[2].starNum,
            masterLevel: sudoData.mode[2],
          }
          this.http.post(url, { data: postData }, httpOptions).subscribe((res) => {
            console.log(res)
          })
        }
      }
    })
  }
}
