import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoduService } from '../service/sodu/sodu.service';
import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { SoduStar } from '../datas/data-types';
import { Storage } from '@ionic/storage';

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
    nowMode: 'Starter',
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

  constructor(
    private soduService: SoduService,
    private router: Router,
    private storage: Storage,
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
    this.soduService.InitSodu()
    let intCount = 0
    this.checksoduReadyInterval = setInterval(() => {
      intCount++
      console.log('checksoduReadyInterval intCount:' + intCount)
      if (this.soduService.SoduShow.soduReady) {
        this.soduData = this.soduService.SoduData
        this.soduShow = this.soduService.SoduShow
        clearInterval(this.checksoduReadyInterval)
      } else if (intCount >= 600) {
        clearInterval(this.checksoduReadyInterval)
        console.log('There is some error!')
      }
      this.startShowTime()
    }, 250)
  }

  newGame(): void {
    this.soduService.newGame()
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
    this.storage.get('stars').then((stars) => {
      if (stars) {
        this.soduStars = stars
      } else {
        this.soduStars = [
          {
            name: 'Starter',
            starNum: 0
          },
          {
            name: 'Normal',
            starNum: 0
          },
          {
            name: 'Master',
            starNum: 0
          }
        ]
      }
      console.log('this.SoduStars[0]: ' + this.soduStars[0].starNum)
      this.setStars()
    })
  }

  setStars() {
    this.soduStars[0].starNum++
    this.storage.set('stars', this.soduStars)
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
