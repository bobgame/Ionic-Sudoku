import { Component, OnInit } from '@angular/core';
import { LanService } from '../../service/lan/lan.service';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  LanData: any
  rankShow = false

  constructor(
    private lanService: LanService,
    private events: Events,
    private storage: Storage
  ) {

    lanService.getLanguage().then(() => {
      if (this.lanService.LanData) {
        this.LanData = this.lanService.LanData
      } else {
        this.lanService.getLanJson()
          .subscribe((data) => { this.LanData = data })
      }
    })

    this.storage.get('sd-data').then((data) => {
      if (data) {
        this.rankShow = true
      }
    })

    this.events.subscribe('lan:dataChange', (dataChange) => {
      this.LanData = dataChange
    })
  }

  ngOnInit() { }

  // for test used
  clearData() {
    // this.sudoService.clearData()
  }

}
