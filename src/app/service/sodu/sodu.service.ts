import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CelShowTime } from '../../../utils/get-time';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ActionSheetController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

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
  SODUDATA = {
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
    },
  }
  soduShow = {
    soduReady: false,
    editNumber: null,
    tipNumberIndexes: [],
    showTime: '00:00'
  }
  showTimeInterval: any

  async InitSodu() {
    this.storage.get('sd-data').then((data) => {
      console.log(data)
      console.log(typeof data)
      if (data) {
        this.SODUDATA = data
        this.soduShow.soduReady = true
      } else {
        console.log('new sodu')
        const hardModeLevel = this.SODUDATA.mode[this.SODUDATA.nowMode]
        this.createSoduArr()
        this.createBlank(hardModeLevel, this.SODUDATA.nowMode)
        this.createSoduEdit()
        console.log(this.SODUDATA)
        this.SODUDATA.time = 0
      }
    })
    const checksoduReadyIntervalS = setInterval(() => {
      console.log('checksoduReadyIntervals')
      if (this.soduShow.soduReady) {
        this.createBackupSoduArr()
        clearInterval(checksoduReadyIntervalS)
      }
    }, 200)

    this.saveData()
  }

  startShowTime() {
    this.soduShow.showTime = CelShowTime(this.SODUDATA.time)
    this.showTimeInterval = setInterval(() => {
      this.SODUDATA.time++
      this.soduShow.showTime = CelShowTime(this.SODUDATA.time)
      this.saveData()
    }, 1000)
  }
  pauseShowTime() {
    clearInterval(this.showTimeInterval)
  }

  // 生成数独
  createSoduArr() {
    try {
      this.SODUDATA.soduArr = []
      this.creatThird(2, 8, this.SODUDATA.soduArr)
      this.creatThird(5, 5, this.SODUDATA.soduArr)
      this.creatThird(8, 2, this.SODUDATA.soduArr)
      // console.log(this.SODUDATA.soduArr)
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          if (this.SODUDATA.soduArr[i * 10 + j]) {
            continue
          }
          const XArr = this.getXArr(i, this.SODUDATA.soduArr)
          const YArr = this.getYArr(j, this.SODUDATA.soduArr)
          const thArr = this.getThArr(i, j, this.SODUDATA.soduArr)
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

          this.SODUDATA.soduArr[i * 10 + j] = item
        }
      }
      this.soduShow.soduReady = true
      this.saveData()
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      this.createSoduArr()
    }
  }

  // 生成备用数独
  createBackupSoduArr() {
    try {
      this.SODUDATA.backupSoduArr = []
      this.creatThird(2, 8, this.SODUDATA.backupSoduArr)
      this.creatThird(5, 5, this.SODUDATA.backupSoduArr)
      this.creatThird(8, 2, this.SODUDATA.backupSoduArr)
      // console.log(this.SODUDATA.backupSoduArr)
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          if (this.SODUDATA.backupSoduArr[i * 10 + j]) {
            continue
          }
          const XArrBackup = this.getXArr(i, this.SODUDATA.backupSoduArr)
          const YArrBackup = this.getYArr(j, this.SODUDATA.backupSoduArr)
          const thArrBackup = this.getThArr(i, j, this.SODUDATA.backupSoduArr)
          const arrBackup = this.getConnect(this.getConnect(XArrBackup, YArrBackup), thArrBackup)
          const ableArrBackup = this.arrMinus(this.numArr, arrBackup)
          if (ableArrBackup.length === 0) {
            this.createBackupSoduArr()
            return
          }

          let itemBackup: number
          // 如果生成的重复了就重新生成，这里只是以防万一的做法。
          do {
            itemBackup = ableArrBackup[this.getRandom(ableArrBackup.length) - 1]
          } while ((arrBackup.indexOf(itemBackup) > -1))

          this.SODUDATA.backupSoduArr[i * 10 + j] = itemBackup
        }
      }
      this.saveData()
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      this.createBackupSoduArr()
    }
  }

  newGame() {
    this.chooseHardModePopup()
  }

  createBlank(level: number, hardMode: string) {
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
    this.SODUDATA.blankArr = arr
    this.saveData()
  }

  seeIfBlank(index: number) {
    return this.SODUDATA.blankArr.indexOf(index) === -1
  }

  createSoduEdit() {
    const arr = []
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const thisIndex = i * 10 + j
        const buckupNum = this.SODUDATA.soduArr[thisIndex]
        if (this.SODUDATA.blankArr.indexOf(thisIndex) > -1) {
          arr[thisIndex] = null
        } else {
          arr[thisIndex] = buckupNum
        }
      }
    }
    this.SODUDATA.soduEditArr = arr
    this.saveData()
  }

  setShowEditNumber(index: number): void {
    this.soduShow.editNumber = index
    // 计算与此空格相关的格子
    this.getRelatedIndex(index)
  }
  clearEditNumber() {
    this.SODUDATA.soduEditArr[this.soduShow.editNumber] = null
    const index = this.SODUDATA.errorArr.indexOf(this.soduShow.editNumber);
    if (index > -1) {
      this.SODUDATA.errorArr.splice(index, 1);
    }
    this.saveData()
  }

  clickEditNumber(num: number): void {
    this.SODUDATA.soduEditArr[this.soduShow.editNumber] = num
    this.checkErrors()
    this.checkIfNumbersFull()
    this.saveData()
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
    this.soduShow.tipNumberIndexes = arr
    console.log(arr)
  }
  checkSomeNumbers(num: number) {
    this.soduShow.editNumber = null
    const arr = []
    for (let a = 0; a < this.SODUDATA.soduEditArr.length; a++) {
      if (this.SODUDATA.soduEditArr[a] === num) {
        arr.push(a)
      }
    }
    this.soduShow.tipNumberIndexes = arr
  }
  checkIfNumbersFull(): void {
    let count = 0
    for (let a = 0; a < this.SODUDATA.soduEditArr.length; a++) {
      if (this.SODUDATA.soduEditArr[a] > 0) {
        count++
      }
    }
    if (count === 81) {
      this.checkResult()
    } else {

    }
  }
  showErrors() {
    console.log('errorArr: ' + this.SODUDATA.errorArr)
  }
  checkErrors() {
    this.SODUDATA.errorArr = []
    for (let a = 0; a < this.SODUDATA.soduEditArr.length; a++) {
      if (this.SODUDATA.soduEditArr[a] > 0) {
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
      if (this.SODUDATA.soduEditArr[xIndex] && xIndex !== index) {
        XArr.push(this.SODUDATA.soduEditArr[xIndex])
      }
    }
    const YArr = []
    for (let b = 1; b <= 9; b++) {
      const yIndex = b * 10 + j
      if (this.SODUDATA.soduEditArr[yIndex] && yIndex !== index) {
        YArr.push(this.SODUDATA.soduEditArr[yIndex])
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
      if (this.SODUDATA.soduEditArr[thIndex] && thIndex !== index) {
        thArr.push(this.SODUDATA.soduEditArr[thIndex])
      }
    }
    const arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
    const val = this.SODUDATA.soduEditArr[index]
    // console.log('XArr: ' + XArr)
    // console.log('YArr: ' + YArr)
    // console.log('thArr: ' + thArr)
    // console.log('arr: ' + arr)
    // console.log('val: ' + val)
    if (arr.indexOf(val) > -1 && this.SODUDATA.blankArr.indexOf(index) > -1) {
      this.SODUDATA.errorArr.push(index)
    }
  }
  // 当输入完整时，检测结果
  checkResult() {
    if (this.SODUDATA.errorArr.length === 0) {
      this.simpleAlert('Tips', 'Congratulations! You win!')
    } else {
      this.showErrors()
    }
  }

  // 存档
  saveData(): void {
    this.storage.set('sd-data', this.SODUDATA)
  }

  createNewGame(hardMode: string) {
    console.log(hardMode + ' clicked');
    this.SODUDATA.time = 0
    this.SODUDATA.errorArr = []
    this.SODUDATA.soduArr = this.SODUDATA.backupSoduArr
    this.createBackupSoduArr()
    this.createBlank(this.SODUDATA.mode[hardMode], hardMode)
    this.createSoduEdit()
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
