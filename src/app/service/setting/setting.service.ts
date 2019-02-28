import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private storage: Storage,
  ) { }

  settings: any

  async loadSettingDatas() {
    // 读取成就等 load game datas
    return this.storage.get('sd-setting').then((setting) => {
      const settingDefault = {
        Lang: '',
        sudo: {
        }
      }
      if (setting) {
        this.settings = setting
      } else {
        this.settings = settingDefault
      }
      this.saveSettingDatas()
    })
  }
  saveSettingDatas() {
    // alert(this.settings.Lang)
    this.storage.set('sd-setting', this.settings)
  }
}
