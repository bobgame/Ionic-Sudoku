import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CelShowTime } from '../../utils/get-time';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private storage: Storage,
  ) { }

  numArr: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  soduArr: Array<number> = []
  blankArr: Array<number> = []
  soduEditArr: Array<number> = []
  errorArr: Array<number> = []
  soduShow = {
    editNumber: null,
    tipNumberIndexes: []
  }
  time = 0
  showTime: string

  ngOnInit() {
    console.log('soduArr: ' + this.soduArr)
    console.log('numArr: ' + this.numArr)
    console.log('blankArr: ' + this.blankArr)
    console.log('soduEditArr: ' + this.soduEditArr)
    this.storage.get('use-sodu').then((sodu) => {
      console.log(sodu)
      console.log(typeof sodu)
      if (sodu) {
        this.soduArr = sodu
      } else {
        console.log('new sodu')
        this.createSoduArr()
      }
      this.storage.get('use-blank').then((blank) => {
        if (blank) {
          this.blankArr = blank
        } else {
          console.log('new blank')
          this.createBlank(3)
        }
        this.storage.get('use-edit').then((edit) => {
          if (edit) {
            this.soduEditArr = edit
          } else {
            console.log('new edit')
            this.createSoduEdit()
          }
          this.storage.get('use-error').then((error) => {
            if (error) {
              this.errorArr = error
            } else {
              this.errorArr = []
            }
            this.storage.get('use-time').then((time) => {
              if (time) {
                this.time = time
              } else {
                this.time = 0
              }
              setInterval(() => {
                this.time++
                this.storage.set('use-time', this.time)
                this.showTime = CelShowTime(this.time)
              }, 1000)
            })
          })
        })
      })
    })
  }

  // 生成数独
  createSoduArr() {
    try {
      this.soduArr = []
      this.creatThird(2, 8)
      this.creatThird(5, 5)
      this.creatThird(8, 2)
      // console.log(soduArr)
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          if (this.soduArr[i * 10 + j]) {
            continue
          }
          const XArr = this.getXArr(i, this.soduArr)
          const YArr = this.getYArr(j, this.soduArr)
          const thArr = this.getThArr(i, j, this.soduArr)
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

          this.soduArr[i * 10 + j] = item
        }
      }
      this.storage.set('use-sodu', this.soduArr)
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      this.reCreate()
    }
  }

  reCreate() {
    this.createSoduArr()
  }

  newGame() {
    this.time = 0
    this.createSoduArr()
    this.createBlank(10)
    this.createSoduEdit()
  }

  createBlank(num: number) {
    // 生成指定数量的空白格子的坐标。
    const arr = []
    let item: number
    for (let a = 0; a < num; a++) {
      do {
        item = this.numArr[this.getRandom(9) - 1] * 10 + this.numArr[this.getRandom(9) - 1]
      } while (arr.indexOf(item) > -1)
      arr.push(item)
    }
    this.blankArr = arr
    this.storage.set('use-blank', this.blankArr)
  }

  seeIfBlank(index: number) {
    return this.blankArr.indexOf(index) === -1
  }

  createSoduEdit() {
    this.soduEditArr = []
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const thisIndex = i * 10 + j
        const buckupNum = this.soduArr[thisIndex]
        if (this.blankArr.indexOf(thisIndex) > -1) {
          this.soduEditArr[thisIndex] = null
        } else {
          this.soduEditArr[thisIndex] = buckupNum
        }
      }
    }
    this.storage.set('use-edit', this.soduEditArr)
  }

  setShowEditNumber(index: number): void {
    this.soduShow.editNumber = index
    // 计算与此空格相关的格子
    this.getRelatedIndex(index)
  }
  clearEditNumber() {
    this.soduEditArr[this.soduShow.editNumber] = null
    const index = this.errorArr.indexOf(this.soduShow.editNumber);
    if (index > -1) {
      this.errorArr.splice(index, 1);
      this.storage.set('use-error', this.errorArr)
    }
    this.storage.set('use-edit', this.soduEditArr)
  }

  clickEditNumber(num: number): void {
    this.soduEditArr[this.soduShow.editNumber] = num
    this.checkErrors()
    this.checkIfNumbersFull()
    this.storage.set('use-edit', this.soduEditArr)
  }

  async simpleAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  creatThird(i: number, j: number) {
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
      this.soduArr[thIndexArr[a]] = sortedNumArr[a]
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
    for (let a = 0; a < this.soduEditArr.length; a++) {
      if (this.soduEditArr[a] === num) {
        arr.push(a)
      }
    }
    this.soduShow.tipNumberIndexes = arr
  }
  checkIfNumbersFull(): void {
    let count = 0
    for (let a = 0; a < this.soduEditArr.length; a++) {
      if (this.soduEditArr[a] > 0) {
        count++
      }
    }
    if (count === 81) {
      this.checkResult()
    } else {

    }
  }
  showErrors() {
    console.log('errorArr: ' + this.errorArr)
  }
  checkErrors() {
    this.errorArr = []
    for (let a = 0; a < this.soduEditArr.length; a++) {
      if (this.soduEditArr[a] > 0) {
        this.checkCell(a)
      }
    }
    this.storage.set('use-error', this.errorArr)
  }
  // 检测每一个一个格子中输入的值，在横竖宫里是否已存在。
  checkCell(index: number) {
    const i = Math.floor(index / 10)
    const j = index % 10
    const XArr = []
    for (let a = 1; a <= 9; a++) {
      const xIndex = i * 10 + a
      if (this.soduEditArr[xIndex] && xIndex !== index) {
        XArr.push(this.soduEditArr[xIndex])
      }
    }
    const YArr = []
    for (let b = 1; b <= 9; b++) {
      const yIndex = b * 10 + j
      if (this.soduEditArr[yIndex] && yIndex !== index) {
        YArr.push(this.soduEditArr[yIndex])
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
      if (this.soduEditArr[thIndex] && thIndex !== index) {
        thArr.push(this.soduEditArr[thIndex])
      }
    }
    const arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
    const val = this.soduEditArr[index]
    // console.log('XArr: ' + XArr)
    // console.log('YArr: ' + YArr)
    // console.log('thArr: ' + thArr)
    // console.log('arr: ' + arr)
    // console.log('val: ' + val)
    if (arr.indexOf(val) > -1 && this.blankArr.indexOf(index) > -1) {
      this.errorArr.push(index)
    }
  }
  // 当输入完整时，检测结果
  checkResult() {
    if (this.errorArr.length === 0) {
      this.simpleAlert('Tips', 'Congratulations! You win!')
    } else {
      this.showErrors()
    }
  }
}
