import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SoduService } from '../service/sodu/sodu.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit, OnDestroy {

  constructor(
    private storage: Storage,
    private soduService: SoduService,
  ) {
    this.soduService.InitSodu()
    const checksoduReadyInterval = setInterval(() => {
      console.log('checksoduReadyInterval')
      if (this.soduService.soduShow.soduReady) {
        this.soduData = this.soduService.SODUDATA
        this.soduShow = this.soduService.soduShow
        clearInterval(checksoduReadyInterval)
        this.startShowTime()
      }
    }, 100)
  }

  numArr: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  soduData = {
    soduArr: [],
    backupSoduArr: [],
    blankArr: [],
    soduEditArr: [],
    errorArr: [],
    time: 0,
    nowMode: 'Starter',
    mode: {
      Starter: 1,
      Normal: 1,
      Master: 1
    }
  }
  soduShow = {
    soduReady: false,
    editNumber: null,
    tipNumberIndexes: [],
    showTime: '00:00'
  }
  showTimeInterval: any

  ngOnDestroy(): void {
    this.pauseShowTime()
  }
  ngOnInit() {
  }

  newGame(): void {
    this.soduService.newGame()
  }

  seeIfBlank(index: number) {
    return this.soduService.seeIfBlank(index)
  }

  setShowEditNumber(index: number): void {
    this.soduService.setShowEditNumber(index)
  }

  clearEditNumber(): void {
    this.soduService.clearEditNumber()
  }

  clickEditNumber(num: number): void {
    this.soduService.clickEditNumber(num)
  }

  checkSomeNumbers(num: number) {
    this.soduService.checkSomeNumbers(num)
  }

  startShowTime() {
    this.soduService.startShowTime()
  }

  pauseShowTime() {
    this.soduService.pauseShowTime()
  }
}
