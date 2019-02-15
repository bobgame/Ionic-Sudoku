import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CelShowTime } from '../../../utils/get-time';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ActionSheetController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { shiftInitState } from '@angular/core/src/view';

@Injectable({
  providedIn: 'root'
})
export class SoduService {

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private storage: Storage,
  ) { }

  numArr: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  SoduData = {
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
    },
  }
  SoduShow = {
    soduReady: false,
    playNumber: null,
    tipNumberIndexes: [],
    showTime: '00:00',
    pauseTime: false
  }
  showTimeInterval: any

  async InitSodu() {
    this.storage.get('sd-data').then((data) => {
      console.log(data)
      console.log(typeof data)
      if (data) {
        this.SoduData = data
        this.SoduShow.soduReady = true
        this.startShowTime()
      } else {
        console.log('new sodu')
        this.createNewGame(this.SoduData.nowMode)
        console.log(this.SoduData)
      }
    })
    this.saveData()
  }

  startShowTime() {
    console.log('Start Show Time')
    clearInterval(this.showTimeInterval)
    this.SoduShow.showTime = CelShowTime(this.SoduData.time)
    this.showTimeInterval = setInterval(() => {
      this.SoduData.time++
      this.SoduShow.showTime = CelShowTime(this.SoduData.time)
      this.SoduShow.pauseTime = false
      this.saveData()
    }, 1000)
  }
  pauseShowTime() {
    console.log('Pause Show Time')
    this.SoduShow.pauseTime = true
    clearInterval(this.showTimeInterval)
  }

  // 生成数独
  createSoduArr() {
    try {
      this.SoduData.soduArr = []
      this.creatThird(2, 8, this.SoduData.soduArr)
      this.creatThird(5, 5, this.SoduData.soduArr)
      this.creatThird(8, 2, this.SoduData.soduArr)
      // console.log(this.SoduData.soduArr)
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          if (this.SoduData.soduArr[i * 10 + j]) {
            continue
          }
          const XArr = this.getXArr(i, this.SoduData.soduArr)
          const YArr = this.getYArr(j, this.SoduData.soduArr)
          const thArr = this.getThArr(i, j, this.SoduData.soduArr)
          const arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
          const ableArr = this.arrMinus(this.numArr, arr)
          if (ableArr.length === 0) {
            this.createSoduArr()
            return
          }

          let item: number
          // 如果生成的重复了就重新生成，这里只是以防万一的做法。
          do {
            item = ableArr[this.getRandom(ableArr.length) - 1]
          } while ((arr.indexOf(item) > -1))
          this.SoduData.soduArr[i * 10 + j] = item
          this.SoduShow.soduReady = true
        }
      }
      this.saveData()
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      this.createSoduArr()
    }
  }

  newGame() {
    this.chooseHardModePopup()
  }

  createBlankArr(level: number, hardMode: string) {
    // 生成指定数量的空白格子的坐标。
    const nowMode = { Starter: 1, Normal: 2, Master: 3 }[hardMode]
    let num = Math.floor(level / 30 * 10 + (nowMode - 1) * 15 + 7)
    num = num < 65 ? num : 65
    const arr = []
    let item: number
    for (let a = 0; a < num; a++) {
      do {
        item = this.numArr[this.getRandom(9) - 1] * 10 + this.numArr[this.getRandom(9) - 1]
      } while (arr.indexOf(item) > -1)
      arr.push(item)
    }
    this.SoduData.blankArr = arr
  }

  createBlankEditBoard(): void {
    this.SoduData.blankEditBoard = []
    for (let a = 0; a < 100; a++) {
      this.SoduData.blankEditBoard[a] = [false, false, false, false, false, false, false, false, false, false]
    }
  }

  seeIfBlank(index: number) {
    return this.SoduData.blankArr.indexOf(index) === -1
  }

  seeIfBlankBoard(index: number) {
    return this.SoduData.blankEditBoard[index][0]
  }

  createSoduPlayArr() {
    const arr = []
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const thisIndex = i * 10 + j
        const buckupNum = this.SoduData.soduArr[thisIndex]
        if (this.SoduData.blankArr.indexOf(thisIndex) > -1) {
          arr[thisIndex] = null
        } else {
          arr[thisIndex] = buckupNum
        }
      }
    }
    this.SoduData.soduPlayArr = arr
    this.saveData()
  }

  setShowPlayNumber(index: number): void {
    this.SoduShow.playNumber = index
    console.log('playNumber: ' + this.SoduShow.playNumber)
    // 计算与此空格相关的格子
    this.getRelatedIndex(index)
  }
  clearPlayNumber() {
    this.SoduData.soduPlayArr[this.SoduShow.playNumber] = null
    const index = this.SoduData.errorArr.indexOf(this.SoduShow.playNumber);
    if (index > -1) {
      this.SoduData.errorArr.splice(index, 1);
    }
    this.saveData()
  }

  clickPlayNumber(num: number): void {
    const thisEditBoard = this.SoduData.blankEditBoard[this.SoduShow.playNumber]
    if (thisEditBoard[0]) {
      thisEditBoard[num] = !thisEditBoard[num]
    } else {
      this.SoduData.soduPlayArr[this.SoduShow.playNumber] = num
      this.checkErrors()
      this.checkIfNumbersFull()
    }
    this.saveData()
  }

  setThisEditBoardStatus() {
    const thisEditBoard = this.SoduData.blankEditBoard[this.SoduShow.playNumber]
    thisEditBoard[0] = !thisEditBoard[0]
  }

  seeIfBlankBoardNumber(index: number, num: number) {
    if (this.SoduData.blankEditBoard.length > 99) {
      return this.SoduData.blankEditBoard[index][num]
    } else {
      return false
    }
  }

  seeIfShowSmallBtn() {
    if (this.SoduData.blankEditBoard.length > 99 && this.SoduShow.playNumber !== null) {
      return this.SoduData.blankEditBoard[this.SoduShow.playNumber][0]
    } else {
      return false
    }
  }

  creatThird(i: number, j: number, soduArr: Array<number>) {
    // 为对角线上的三个三宫格随机生成。
    const sortedNumArr = this.numArr.slice().sort(function () {
      return Math.random() > 0.5 ? -1 : 1
    })
    const centerNum = i * 10 + j
    /***********
     * 11 12 13
     * 21 22 23
     * 31 32 33
     ***********/
    const thIndexArr = [
      centerNum - 11, centerNum - 10, centerNum - 9,
      centerNum - 1, centerNum, centerNum + 1,
      centerNum + 9, centerNum + 10, centerNum + 11
    ]
    for (let a = 0; a < 9; a++) {
      soduArr[thIndexArr[a]] = sortedNumArr[a]
    }
  }

  /**
   * 获取所在列的值。
   *
   * @param {Number} j y
   * @param {Array} dataArr dataArr
   * @returns
   */
  getYArr(j: number, dataArr: Array<number>) {
    const arr = []
    for (let a = 1; a <= 9; a++) {
      if (dataArr[a * 10 + j]) {
        arr.push(dataArr[a * 10 + j])
      }
    }
    return arr
  }

  /**
   * 获取所在行的值。
   *
   * @param {Number} i x
   * @param {Array} dataArr dataArr
   * @returns
   */
  getXArr(i: number, dataArr: Array<number>) {
    const arr = []
    for (let a = 1; a <= 9; a++) {
      if (dataArr[i * 10 + a]) {
        arr.push(dataArr[i * 10 + a])
      }
    }
    return arr
  }

  /**
   * 获取所在三宫格的值
   *
   * @param {*} i x
   * @param {*} j y
   * @param {*} dataArr dataArr
   * @returns
   */
  getThArr(i: number, j: number, dataArr: Array<number>) {
    const arr = []
    const centerNum = this.getTh(i, j)
    const thIndexArr = [
      centerNum - 11, centerNum - 10, centerNum - 9,
      centerNum - 1, centerNum, centerNum + 1,
      centerNum + 9, centerNum + 10, centerNum + 11
    ]
    for (let a = 0; a < 9; a++) {
      if (dataArr[thIndexArr[a]]) {
        arr.push(dataArr[thIndexArr[a]])
      }
    }
    return arr
  }
  // 获取所在三宫格的中间位坐标。
  getTh(i: number, j: number) {
    const cenArr = [22, 25, 28, 52, 55, 58, 82, 85, 88]
    // i为0 1 2 j逢3进1 0-8
    const index = (Math.ceil(i / 3) - 1) * 3 + Math.ceil(j / 3) - 1
    const centerNum = cenArr[index]
    return centerNum
  }
  // 两个简单数组的并集
  getConnect(arr1: Array<number>, arr2: Array<number>) {
    const resArr = arr2.slice()
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) < 0) {
        resArr.push(arr1[i])
      }
    }
    return resArr
  }
  // 两个简单数组差集，arr1为大数组
  arrMinus(arr1: Array<number>, arr2: Array<number>) {
    const resArr: Array<number> = []
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) < 0) {
        resArr.push(arr1[i])
      }
    }
    return resArr
  }
  // 生成随机正整数
  getRandom(n: number): number {
    return Math.floor(Math.random() * n + 1)
  }
  // 获取空格相关空格
  getRelatedIndex(index: number) {
    const i = Math.floor(index / 10)
    const j = index % 10
    const xIndexArr = []
    for (let a = 1; a <= 9; a++) {
      xIndexArr.push(i * 10 + a)
    }
    const yIndexArr = []
    for (let b = 1; b <= 9; b++) {
      yIndexArr.push(b * 10 + j)
    }
    const centerNum = this.getTh(i, j)
    const thIndexArr = [
      centerNum - 11, centerNum - 10, centerNum - 9,
      centerNum - 1, centerNum, centerNum + 1,
      centerNum + 9, centerNum + 10, centerNum + 11
    ]
    const arr = this.getConnect(this.getConnect(xIndexArr, yIndexArr), thIndexArr)
    this.SoduShow.tipNumberIndexes = arr
    console.log(arr)
  }
  checkSomeNumbers(num: number) {
    this.SoduShow.playNumber = null
    const arr = []
    for (let a = 0; a < this.SoduData.soduPlayArr.length; a++) {
      if (this.SoduData.soduPlayArr[a] === num) {
        arr.push(a)
      }
    }
    this.SoduShow.tipNumberIndexes = arr
  }
  checkIfNumbersFull(): void {
    let count = 0
    for (let a = 0; a < this.SoduData.soduPlayArr.length; a++) {
      if (this.SoduData.soduPlayArr[a] > 0) {
        count++
      }
    }
    if (count === 81) {
      this.checkResult()
    } else {

    }
  }
  showErrors() {
    console.log('errorArr: ' + this.SoduData.errorArr)
  }
  checkErrors() {
    this.SoduData.errorArr = []
    for (let a = 0; a < this.SoduData.soduPlayArr.length; a++) {
      if (this.SoduData.soduPlayArr[a] > 0) {
        this.checkCell(a)
      }
    }
    this.saveData()
  }
  // 检测每一个一个格子中输入的值，在横竖宫里是否已存在。
  checkCell(index: number) {
    const i = Math.floor(index / 10)
    const j = index % 10
    const XArr = []
    for (let a = 1; a <= 9; a++) {
      const xIndex = i * 10 + a
      if (this.SoduData.soduPlayArr[xIndex] && xIndex !== index) {
        XArr.push(this.SoduData.soduPlayArr[xIndex])
      }
    }
    const YArr = []
    for (let b = 1; b <= 9; b++) {
      const yIndex = b * 10 + j
      if (this.SoduData.soduPlayArr[yIndex] && yIndex !== index) {
        YArr.push(this.SoduData.soduPlayArr[yIndex])
      }
    }
    const thArr = []
    const centerNum = this.getTh(i, j)
    const thIndexArr = [
      centerNum - 11, centerNum - 10, centerNum - 9,
      centerNum - 1, centerNum, centerNum + 1,
      centerNum + 9, centerNum + 10, centerNum + 11
    ]
    for (let c = 0; c < 9; c++) {
      const thIndex = thIndexArr[c]
      if (this.SoduData.soduPlayArr[thIndex] && thIndex !== index) {
        thArr.push(this.SoduData.soduPlayArr[thIndex])
      }
    }
    const arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
    const val = this.SoduData.soduPlayArr[index]
    // console.log('XArr: ' + XArr)
    // console.log('YArr: ' + YArr)
    // console.log('thArr: ' + thArr)
    // console.log('arr: ' + arr)
    // console.log('val: ' + val)
    if (arr.indexOf(val) > -1 && this.SoduData.blankArr.indexOf(index) > -1) {
      this.SoduData.errorArr.push(index)
    }
  }
  // 当输入完整时，检测结果
  checkResult() {
    if (this.SoduData.errorArr.length === 0) {
      this.simpleAlert('Tips', 'Congratulations! You win!')
    } else {
      this.showErrors()
    }
  }

  // 存档
  saveData(): void {
    this.storage.set('sd-data', this.SoduData)
  }

  createNewGame(hardMode: string) {
    console.log(hardMode + ' game start!');
    this.pauseShowTime()
    this.SoduData.time = 0
    this.SoduData.errorArr = []
    this.createBlankEditBoard()
    this.createSoduArr()
    this.createBlankArr(this.SoduData.mode[hardMode], hardMode)
    this.createSoduPlayArr()
    this.saveData()
    this.startShowTime()
    console.log(this.SoduData)
  }

  // 弹窗类
  async chooseHardModePopup() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Hard Mode',
      buttons: [{
        text: 'Starter',
        icon: 'grid',
        handler: () => {
          this.createNewGame('Starter')
        }
      }, {
        text: 'Normal',
        icon: 'grid',
        handler: () => {
          this.createNewGame('Normal')
        }
      }, {
        text: 'Master',
        icon: 'grid',
        handler: () => {
          this.createNewGame('Master')
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async simpleAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
