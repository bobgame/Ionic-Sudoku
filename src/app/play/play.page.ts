import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoduService } from '../service/sodu/sodu.service';
import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { SoduStar } from '../datas/data-types';
import { Storage } from '@ionic/storage';
import { LanService } from '../service/lan/lan.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit, OnDestroy {
  endSubscription: Subscription

  numArr: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  starArr: Array<number> = []
  soduData = {
    soduArr: [],
    blankArr: [],
    blankEditBoard: [],
    soduPlayArr: [],
    errorArr: [],
    time: 0,
    star: 5,
    nowMode: 0,
    mode: {
      Starter: 1,
      Normal: 1,
      Master: 1
    }
  }
  soduShow = {
    soduReady: false,
    playNumber: null,
    tipNumberIndexes: [],
    showTime: '00:00',
    pauseTime: false,
  }
  soduPlay = {
    playId: 999,
  }
  soduStars: SoduStar[]
  showTimeInterval: any
  checksoduReadyInterval: any
  playBtnStatus = false
  LanData
  hardModeName

  constructor(
    private soduService: SoduService,
    private router: Router,
    private storage: Storage,
    private lanService: LanService,
  ) {
    this.starArr = this.soduService.starArr
    this.soduPlay = this.soduService.SoduPlay
    this.endSubscription = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(_ => {
      console.log('End Subscription, Time: ' + this.soduShow.showTime)
      this.soduPlay.playId = Math.floor(Math.random() * 1000)
      this.pauseShowTime()
    })
  }

  ngOnInit() {
    this.getStars()
    this.initSodu()
  }
  ngOnDestroy() {
    this.endSubscription.unsubscribe() // 不要忘记处理手动订阅
  }

  initSodu() {
    this.soduService.InitSodu().then(() => {
      this.soduData = this.soduService.SoduData
      this.soduShow = this.soduService.SoduShow
      this.lanService.getLanguage().then(() => {
        if (this.lanService.LanData) {
          this.LanData = this.lanService.LanData
          this.hardModeName = [this.LanData.common.starter, this.LanData.common.normal, this.LanData.common.master]
        } else {
          this.lanService.getLanJson()
            .subscribe((data) => {
              this.LanData = data
              this.hardModeName = [this.LanData.common.starter, this.LanData.common.normal, this.LanData.common.master]
            })
        }
      })
    })
  }

  newGame(): void {
    this.soduService.newGame()
  }

  getModeName() {
    if (this.hardModeName && this.soduData) {
      return this.hardModeName[this.soduData.nowMode]
    }
    return ''
  }

  seeIfBlank(index: number) {
    return this.soduService.seeIfBlank(index)
  }

  seeIfBlankBoard(index: number) {
    return this.soduService.seeIfBlankBoard(index)
  }

  setThisEditBoardStatus() {
    return this.soduService.setThisEditBoardStatus()
  }

  seeIfBlankBoardNumber(index: number, num: number) {
    return this.soduService.seeIfBlankBoardNumber(index, num)
  }

  seeIfShowSmallBtn() {
    return this.soduService.seeIfShowSmallBtn()
  }

  setShowPlayNumber(index: number): void {
    this.soduService.setShowPlayNumber(index)
  }

  numEmptyPress(index: number): void {
    this.setShowPlayNumber(index)
    this.setThisEditBoardStatus()
  }

  clearPlayNumber(): void {
    this.soduService.clearPlayNumber()
  }

  clickPlayNumber(num: number): void {
    this.soduService.clickPlayNumber(num)
  }

  checkSomeNumbers(num: number) {
    this.soduService.checkSomeNumbers(num)
  }

  clickPlayOrPauseBtn() {
    if (this.playBtnStatus) {
      this.startShowTime()
    } else {
      this.pauseShowTime()
    }
    this.playBtnStatus = !this.playBtnStatus
  }

  getStars() {
    this.soduService.getStars().then(() => {
      this.soduStars = this.soduService.SoduStars
    })
  }

  setStars() {
    this.soduService.setStars()
  }

  testStar() {
    if (this.soduStars) {
      return this.soduStars[0].starNum
    }
    return 0
  }

  startShowTime() {
    this.soduService.startShowTime()
  }

  pauseShowTime() {
    this.soduService.pauseShowTime()
  }
}
