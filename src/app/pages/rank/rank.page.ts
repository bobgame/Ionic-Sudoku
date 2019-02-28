import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.page.html',
  styleUrls: ['./rank.page.scss'],
})
export class RankPage implements OnInit {

  rankData: any

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getRankData()
  }

  getRankData() {
    // const urlRank = 'http://47.92.132.100:603/sdkdb/find'
    const urlRank = 'http://localhost:603/sdkdb/find'
    this.http.post(urlRank, '').subscribe((data) => {
      this.rankData = data
      console.log(data)
    })
  }

}
