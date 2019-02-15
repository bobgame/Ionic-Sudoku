import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SoduService } from '../service/sodu/sodu.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  constructor(
    private storage: Storage,
    private soduService: SoduService,
    private zone: NgZone,
  ) {
    zone.run(() => {
      console.log(Math.random())
    })
  }

  numArr: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  soduData = {
    soduArr: [],
    blankArr: [],
    blankEditBoard: [],
    soduPlayArr: [],
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
    playNumber: null,
    tipNumberIndexes: [],
    showTime: '00:00',
    pauseTime: false
  }
  showTimeInterval: any
  checksoduReadyInterval: any

  ngOnInit() {
    this.soduService.InitSodu()
    let intCount = 0
    this.checksoduReadyInterval = setInterval(() => {
      intCount++
      console.log('checksoduReadyInterval intCount:' + intCount)
      this.initGame(intCount)
    }, 250)
  }

  initGame(count: number) {
    console.log(this.soduService.showTimeInterval)
    if (this.soduService.SoduShow.soduReady) {
      this.soduData = this.soduService.SoduData
      this.soduShow = this.soduService.SoduShow
      clearInterval(this.checksoduReadyInterval)
    } else if (count >= 600) {
      clearInterval(this.checksoduReadyInterval)
      console.log('There is some error!')
    }
    this.startShowTime()
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

  clearPlayNumber(): void {
    this.soduService.clearPlayNumber()
  }

  clickPlayNumber(num: number): void {
    this.soduService.clickPlayNumber(num)
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
