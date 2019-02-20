import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../service/sodu/sodu.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LanService } from '../../service/lan/lan.service';

@Component({
  selector: 'app-go-sodu',
  templateUrl: './go-sodu.component.html',
  styleUrls: ['./go-sodu.component.scss']
})
export class GoSoduComponent implements OnInit {

  soduPlay = {
    playId: 123,
  }
  hardModeName: string[]
  continueButton: boolean
  LanData
  constructor(
    private soduService: SoduService,
    private router: Router,
    private storage: Storage,
    private lanService: LanService,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.soduPlay = this.soduService.SoduPlay
    this.hardModeName = this.soduService.hardModeName

    lanService.getLanguage().then(() => {
      if (lanService.LanData) {
        console.log(333333333333)
        this.LanData = lanService.LanData
        this.hardModeName = [this.LanData.common.starter, this.LanData.common.normal, this.LanData.common.master]
      } else {
        lanService.getLanJson()
          .subscribe((data) => {
            this.LanData = data
            this.hardModeName = [this.LanData.common.starter, this.LanData.common.normal, this.LanData.common.master]
          })
      }
    })
  }

  ngOnInit() {
    this.storage.get('sd-data').then((data) => {
      if (data) {
        this.continueButton = true
      } else {
        this.continueButton = false
      }
    })
  }

  continueSodu() {
    this.router.navigate([`/play/${this.soduPlay.playId}`])
  }

  goToSodu(index: number) {
    this.soduService.createNewGame(index)
    this.router.navigate([`/play/${this.soduPlay.playId}`])
  }

  // for test used
  clearData() {
    this.soduService.clearData()
  }

}
