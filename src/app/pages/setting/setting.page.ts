import { Component, OnInit } from '@angular/core';
import { LanService } from '../../service/lan/lan.service';
import { SettingService } from '../../service/setting/setting.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  LanData: any
  lanValue: any
  settings: any
  constructor(
    private lanService: LanService,
    private settingService: SettingService,
    private events: Events,
  ) {
  }

  ngOnInit() {
    this.getLanguage()
  }

  select() {
    // console.log(this.lanValue);
    this.settingService.settings.Lang = this.lanValue
    this.settings.Lang = this.lanValue
    this.settingService.saveSettingDatas()
    this.getNewLanguage(this.lanValue)
  }


  getLanguage() {
    this.lanService.getLanguage().then(() => {
      if (this.lanService.LanData) {
        this.LanData = this.lanService.LanData
      } else {
        this.lanService.getLanJson()
          .subscribe((data) => { this.LanData = data })
      }
      this.lanValue = this.settingService.settings.Lang
      this.settings = this.settingService.settings
      // console.log(this.LanData)
    })
  }
  getNewLanguage(Lang) {
    this.lanService.getLanJsonWithLang(Lang)
      .subscribe((data) => {
        {
          this.lanService.LanData = data
          this.LanData = data
          this.events.publish('lan:dataChange', data);
        }
      })
  }

}
