import { Component, OnInit } from '@angular/core';
import { SudoService } from '../../../service/sudo/sudo.service';
import { LanService } from '../../../service/lan/lan.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  sudoPlay = {
    playId: 123,
  }
  LanData
  constructor(
    private sudoService: SudoService,
    private lanService: LanService,
    private events: Events,
  ) {
    this.sudoPlay.playId = Math.floor(Math.random() * 1000)
    this.sudoPlay = this.sudoService.SudoPlay

    lanService.getLanguage().then(() => {
      if (this.lanService.LanData) {
        this.LanData = this.lanService.LanData
      } else {
        this.lanService.getLanJson()
          .subscribe((data) => { this.LanData = data })
      }
    })

    events.subscribe('lan:dataChange', (data) => {
      this.LanData = data
    })
  }

  ngOnInit() { }

  // for test used
  clearData() {
    this.sudoService.clearData()
  }

}

