import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../service/sodu/sodu.service';
import { LanService } from '../../service/lan/lan.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  soduPlay = {
    playId: 123,
  }
  LanData
  constructor(
    private soduService: SoduService,
    private lanService: LanService,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.soduPlay = this.soduService.SoduPlay

    lanService.getLanguage().then(() => {
      if (this.lanService.LanData) {
        this.LanData = this.lanService.LanData
      } else {
        this.lanService.getLanJson()
          .subscribe((data) => { this.LanData = data })
      }
    })
  }

  ngOnInit() { }

  // for test used
  clearData() {
    this.soduService.clearData()
  }

}
