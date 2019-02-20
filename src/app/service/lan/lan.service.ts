import { Injectable } from '@angular/core';
import { SettingService } from '../setting/setting.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LanService {

  constructor(
    private settingService: SettingService,
    private http: HttpClient,
  ) {
  }

  LanData
  Language
  Lang
  LangNum: any
  settings: any
  getLanJson() {
    console.log(this.LanData)
    return this.http.get(`assets/i18n/${this.Lang}.json`)
  }
  async getLanData() {
    this.http.get(`assets/i18n/${this.Lang}.json`).subscribe((data) => {
      this.LanData = data
    })
  }
  async getLanguage() {
    if (this.LangNum) {
      return this.LangNum
    } else {
      return this.settingService.loadSettingDatas().then((setting) => {
        this.settings = this.settingService.settings
        this.LangNum = this.settings.sodu.LangNum
        console.log('get language this.LangNum: ' + this.LangNum)
        if (this.LangNum === 0) {
          this.Language = navigator.language
          console.log('this.Language: ' + this.Language)
          if (this.Language.indexOf('zh') > -1) {
            if (this.Language.indexOf('zh-HK') > -1 ||
              this.Language.indexOf('zh-MO') > -1 ||
              this.Language.indexOf('zh-SG') > -1 ||
              this.Language.indexOf('zh-TW') > -1) {
              this.Lang = 'zh-ft'
              this.LangNum = 2
            } else {
              this.Lang = 'zh-jt'
              this.LangNum = 1
            }
          } else {
            this.Lang = 'en'
            this.LangNum = 3
          }
        } else if (this.LangNum === 1) {
          this.Lang = 'zh-jt'
        } else if (this.LangNum === 2) {
          this.Lang = 'zh-ft'
        } else if (this.LangNum === 3) {
          this.Lang = 'en'
        }
        // this.Lang = 'en'
        // this.LangNum = 3
        this.settings.sodu.LangNum = this.LangNum
        console.log('this.LangNum: ' + this.LangNum)
        console.log('this.settings.sodu: ' + this.settings.sodu.LangNum)
        this.settingService.saveSettingDatas()
      })
    }
  }
}
