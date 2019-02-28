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
  settings: any
  getLanJson() {
    // console.log(this.LanData)
    return this.http.get(`assets/i18n/${this.Lang}.json`)
  }
  getLanJsonWithLang(Lang) {
    return this.http.get(`assets/i18n/${Lang}.json`)
  }
  async getLanData() {
    this.http.get(`assets/i18n/${this.Lang}.json`).subscribe((data) => {
      this.LanData = data
    })
  }
  async getLanguage() {
    if (this.Lang) {
      return this.Lang
    } else {
      return this.getNewLanguage().then()
    }
  }
  async getNewLanguage() {
    return this.settingService.loadSettingDatas().then((setting) => {
      this.settings = this.settingService.settings
      this.Lang = this.settingService.settings.Lang
      // console.log('get language this.Lang: ' + this.Lang)
      if (this.Lang === '') {
        this.Language = navigator.language
        // console.log('this.Language: ' + this.Language)
        if (this.Language.indexOf('zh') > -1) {
          if (this.Language.indexOf('zh-HK') > -1 ||
            this.Language.indexOf('zh-MO') > -1 ||
            this.Language.indexOf('zh-SG') > -1 ||
            this.Language.indexOf('zh-TW') > -1) {
            this.Lang = 'zh-ft'
          } else {
            this.Lang = 'zh-jt'
          }
        } else {
          this.Lang = 'en'
        }
      }
      // this.Lang = 'en'
      this.settingService.settings.Lang = this.Lang
      // console.log('this.Lang: ' + this.Lang)
      // console.log('this.settings.sudo: ' + this.settings.Lang)
      this.settingService.saveSettingDatas()
    })
  }

}
