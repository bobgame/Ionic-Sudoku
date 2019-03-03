import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CelShowTime } from '../../../utils/get-time';
import { Storage } from '@ionic/storage';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SudoService {

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private storage: Storage,
  ) { }
  numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  starArr = [1, 2, 3, 4, 5]
  sudoName = 'Simple Sudoku'
  hardModeName = ['Starter', 'Normal', 'Master']
  STAR_MAX = this.starArr.length
  SudoData = {
    sudoArr: [],
    blankArr: [],
    blankEditBoard: [],
    sudoPlayArr: [],
    errorArr: [],
    time: 0,
    star: this.STAR_MAX,
    nowMode: 0,
    mode: [1, 1, 1],
    allStars: [
      {
        mode: 0,
        starNum: 0,
        totalTime: 0,
      },
      {
        mode: 1,
        starNum: 0,
        totalTime: 0,
      },
      {
        mode: 2,
        starNum: 0,
        totalTime: 0,
      }
    ]
  }
  SudoShow = {
    sudoReady: false,
    playNumber: null,
    tipNumberIndexes: [],
    showTime: '00:00',
    pauseTime: false,
    nowGameWin: false,
    winStar: 0,
  }
  showTimeInterval: any

  async InitSudo() {
    return this.storage.get('sd-data').then((data) => {
      if (data) {
        if (data.sudoArr.length > 0) {
          this.SudoData = data
          this.SudoShow.sudoReady = true
          // this.startShowTime()
          console.log('load datas')
        } else {
          this.SudoData = data
          // this.createNewGame(this.SudoData.nowMode)
        }
      } else {
        // this.createNewGame(this.SudoData.nowMode)
        // console.log('New sudo: ' + this.SudoData)
      }
      this.saveData()
    })
  }

  startShowTime() {
    console.log('Start Show Time: ' + this.SudoShow.showTime)
    clearInterval(this.showTimeInterval)
    this.SudoShow.showTime = CelShowTime(this.SudoData.time)
    this.showTimeInterval = setInterval(() => {
      this.SudoData.time++
      this.SudoShow.showTime = CelShowTime(this.SudoData.time)
      this.SudoShow.pauseTime = false
      this.saveData()
    }, 1000)
  }
  pauseShowTime() {
    console.log('Pause Show Time: ' + this.SudoShow.showTime)
    this.SudoShow.pauseTime = true
    clearInterval(this.showTimeInterval)
  }

  // 生成数独
  createSudoArr() {
    try {
      this.SudoData.sudoArr = []
      this.creatThird(2, 8, this.SudoData.sudoArr)
      this.creatThird(5, 5, this.SudoData.sudoArr)
      this.creatThird(8, 2, this.SudoData.sudoArr)
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          if (this.SudoData.sudoArr[i * 10 + j]) {
            continue
          }
          const XArr = this.getXArr(i, this.SudoData.sudoArr)
          const YArr = this.getYArr(j, this.SudoData.sudoArr)
          const thArr = this.getThArr(i, j, this.SudoData.sudoArr)
          const arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
          const ableArr = this.arrMinus(this.numArr, arr)
          if (ableArr.length === 0) {
            this.createSudoArr()
            return
          }

          let item: number
          // 如果生成的重复了就重新生成，这里只是以防万一的做法。
          do {
            item = ableArr[this.getRandom(ableArr.length) - 1]
          } while ((arr.indexOf(item) > -1))
          this.SudoData.sudoArr[i * 10 + j] = item
          this.SudoShow.sudoReady = true
        }
      }
      this.saveData()
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      this.createSudoArr()
    }
  }

  newGame(common: any) {
    this.chooseHardModePopup(common)
  }

  createBlankArr(level: number, hardMode: number) {
    // 生成指定数量的空白格子的坐标。
    let num = Math.floor(level / 30 * 10 + hardMode * 15 + 7)
    num = num < 65 ? num : 65
    const arr = []
    let item: number
    for (let a = 0; a < num; a++) {
      do {
        item = this.numArr[this.getRandom(9) - 1] * 10 + this.numArr[this.getRandom(9) - 1]
      } while (arr.indexOf(item) > -1)
      arr.push(item)
    }
    this.SudoData.blankArr = arr
  }

  createBlankEditBoard(): void {
    this.SudoData.blankEditBoard = []
    for (let a = 0; a < 100; a++) {
      this.SudoData.blankEditBoard[a] = [false, false, false, false, false, false, false, false, false, false]
    }
  }

  seeIfBlank(index: number) {
    return this.SudoData.blankArr.indexOf(index) === -1
  }

  seeIfBlankBoard(index: number) {
    return this.SudoData.blankEditBoard[index][0]
  }

  createSudoPlayArr() {
    const arr = []
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const thisIndex = i * 10 + j
        const buckupNum = this.SudoData.sudoArr[thisIndex]
        if (this.SudoData.blankArr.indexOf(thisIndex) > -1) {
          arr[thisIndex] = null
        } else {
          arr[thisIndex] = buckupNum
        }
      }
    }
    this.SudoData.sudoPlayArr = arr
    this.saveData()
  }

  setShowPlayNumber(index: number): void {
    this.SudoShow.playNumber = index
    // console.log('playNumber: ' + this.SudoShow.playNumber)
    // 计算与此空格相关的格子
    this.getRelatedIndex(index)
  }
  clearPlayNumber() {
    this.SudoData.sudoPlayArr[this.SudoShow.playNumber] = null
    const index = this.SudoData.errorArr.indexOf(this.SudoShow.playNumber);
    if (index > -1) {
      this.SudoData.errorArr.splice(index, 1);
    }
    this.saveData()
  }

  clickPlayNumber(num: number): void {
    const thisEditBoard = this.SudoData.blankEditBoard[this.SudoShow.playNumber]
    if (thisEditBoard[0]) {
      thisEditBoard[num] = !thisEditBoard[num]
    } else {
      this.SudoData.sudoPlayArr[this.SudoShow.playNumber] = num
      const errorLengthBefore = this.SudoData.errorArr.length
      this.checkErrors()
      const errorLengthAfter = this.SudoData.errorArr.length
      if (errorLengthAfter > errorLengthBefore) {
        if (this.SudoData.star > 0) { this.SudoData.star-- }
      }
      this.checkIfNumbersFull()
    }
    this.saveData()
  }

  setThisEditBoardStatus() {
    const thisEditBoard = this.SudoData.blankEditBoard[this.SudoShow.playNumber]
    thisEditBoard[0] = !thisEditBoard[0]
  }

  seeIfBlankBoardNumber(index: number, num: number) {
    if (this.SudoData.blankEditBoard.length > 99) {
      return this.SudoData.blankEditBoard[index][num]
    } else {
      return false
    }
  }

  seeIfShowSmallBtn() {
    if (this.SudoData.blankEditBoard.length > 99 && this.SudoShow.playNumber !== null) {
      return this.SudoData.blankEditBoard[this.SudoShow.playNumber][0]
    } else {
      return false
    }
  }

  creatThird(i: number, j: number, sudoArr: Array<number>) {
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
      sudoArr[thIndexArr[a]] = sortedNumArr[a]
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
    this.SudoShow.tipNumberIndexes = arr
    // console.log(arr)
  }
  checkSomeNumbers(num: number) {
    this.SudoShow.playNumber = null
    const arr = []
    for (let a = 0; a < this.SudoData.sudoPlayArr.length; a++) {
      if (this.SudoData.sudoPlayArr[a] === num) {
        arr.push(a)
      }
    }
    this.SudoShow.tipNumberIndexes = arr
  }
  checkIfNumbersFull(): void {
    let count = 0
    for (let a = 0; a < this.SudoData.sudoPlayArr.length; a++) {
      if (this.SudoData.sudoPlayArr[a] > 0) {
        count++
      }
    }
    if (count === 81) {
      this.checkResult()
    }
  }
  showErrors() {
    // console.log('errorArr: ' + this.SudoData.errorArr)
  }
  checkErrors() {
    this.SudoData.errorArr = []
    for (let a = 0; a < this.SudoData.sudoPlayArr.length; a++) {
      if (this.SudoData.sudoPlayArr[a] > 0) {
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
      if (this.SudoData.sudoPlayArr[xIndex] && xIndex !== index) {
        XArr.push(this.SudoData.sudoPlayArr[xIndex])
      }
    }
    const YArr = []
    for (let b = 1; b <= 9; b++) {
      const yIndex = b * 10 + j
      if (this.SudoData.sudoPlayArr[yIndex] && yIndex !== index) {
        YArr.push(this.SudoData.sudoPlayArr[yIndex])
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
      if (this.SudoData.sudoPlayArr[thIndex] && thIndex !== index) {
        thArr.push(this.SudoData.sudoPlayArr[thIndex])
      }
    }
    const arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
    const val = this.SudoData.sudoPlayArr[index]
    // console.log('XArr: ' + XArr)
    // console.log('YArr: ' + YArr)
    // console.log('thArr: ' + thArr)
    // console.log('arr: ' + arr)
    // console.log('val: ' + val)
    if (arr.indexOf(val) > -1 && this.SudoData.blankArr.indexOf(index) > -1) {
      this.SudoData.errorArr.push(index)
    }
  }
  // 当输入完整时，检测结果
  checkResult() {
    if (this.SudoData.errorArr.length === 0) {
      this.SudoShow.winStar = this.SudoData.star
      const thisSudoStar = this.SudoData.allStars.find(s => s.mode === this.SudoData.nowMode)
      thisSudoStar.starNum += this.SudoShow.winStar
      thisSudoStar.totalTime += this.SudoData.time
      this.SudoData.mode[this.SudoData.nowMode] += 1
      console.log(this.SudoData.mode[this.SudoData.nowMode])
      this.pauseShowTime()
      this.SudoData.time = 0
      this.SudoData.errorArr = []
      this.SudoData.star = this.STAR_MAX
      this.SudoShow.playNumber = null
      this.SudoShow.tipNumberIndexes = []
      this.SudoData.sudoArr = []
      this.SudoShow.nowGameWin = true
      this.saveData()
      // this.simpleAlert('Tips', 'Congratulations! You win!')
    } else {
      this.showErrors()
    }
  }

  // 存档
  saveData(): void {
    if (this.SudoData.sudoPlayArr.length > 98) {
      this.storage.set('sd-data', this.SudoData)
    }
  }

  createNewGame(hardMode: number) {
    console.log(hardMode + ' game start!');
    this.pauseShowTime()
    this.SudoData.nowMode = hardMode
    this.SudoData.time = 0
    this.SudoShow.nowGameWin = false
    this.SudoData.errorArr = []
    this.SudoData.star = this.STAR_MAX
    this.SudoShow.playNumber = null
    this.SudoShow.tipNumberIndexes = []
    this.createBlankEditBoard()
    this.createSudoArr()
    this.createBlankArr(this.SudoData.mode[hardMode], hardMode)
    this.createSudoPlayArr()
    this.saveData()
    this.startShowTime()
    // console.log(this.SudoData)
  }

  // 弹窗类
  async chooseHardModePopup(common: any) {
    const actionSheet = await this.actionSheetController.create({
      header: common.newGame,
      buttons: [{
        text: common.starter,
        // icon: 'grid',
        handler: () => {
          this.createNewGame(0)
        }
      }, {
        text: common.normal,
        // icon: 'grid',
        handler: () => {
          this.createNewGame(1)
        }
      }, {
        text: common.master,
        // icon: 'grid',
        handler: () => {
          this.createNewGame(2)
        }
      }, {
        text: common.cancel,
        // icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
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

  // for test used
  clearData() {
    this.storage.remove('sd-setting')
    this.storage.remove('sd-data')
  }
}
