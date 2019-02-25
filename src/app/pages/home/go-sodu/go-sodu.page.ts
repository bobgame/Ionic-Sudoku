import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../../service/sodu/sodu.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LanService } from '../../../service/lan/lan.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-go-sodu',
  templateUrl: './go-sodu.page.html',
  styleUrls: ['./go-sodu.page.scss'],
})
export class GoSoduPage implements OnInit {

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
    private events: Events,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.soduPlay = this.soduService.SoduPlay
    this.hardModeName = this.soduService.hardModeName

    lanService.getLanguage().then(() => {
      if (lanService.LanData) {
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
    events.subscribe('lan:dataChange', (data) => {
      this.LanData = data
    })
  }

  ngOnInit() {
    this.storage.get('sd-data').then((data) => {
      if (data) {
        if (data.soduArr.length > 0) { this.continueButton = true }
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

}
