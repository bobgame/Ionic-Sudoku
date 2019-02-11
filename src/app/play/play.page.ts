import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  constructor() {}

  ngOnInit() {
    this.createSoduArr()
    this.createBlank(10)
    this.createSoduEdit()
    console.log('soduArr: ' + this.soduArr)
    console.log('backupSoduArr: ' + this.backupSoduArr)
    console.log('numArr: ' + this.numArr)
    console.log('blankArr: ' + this.blankArr)
  }



  numArr: Array < number > = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  soduArr: Array < number > ;
  backupSoduArr: Array < number > ;
  blankArr: Array < number > ;
  soduEditArr: Array < number > ;

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
          if (this.soduArr[parseInt(i + '' + j)]) {
            continue
          }
          let XArr = this.getXArr(i, this.soduArr)
          let YArr = this.getYArr(j, this.soduArr)
          let thArr = this.getThArr(i, j, this.soduArr)
          let arr = this.getConnect(this.getConnect(XArr, YArr), thArr)
          let ableArr = this.arrMinus(this.numArr, arr)
          if (ableArr.length === 0) {
            this.createSoduArr()
            return
          }

          let item: number
          // 如果生成的重复了就重新生成。看起来这里只是以防万一的做法。
          do {
            item = ableArr[this.getRandom(ableArr.length) - 1]
          } while ((arr.indexOf(item) > -1))

          this.soduArr[parseInt(i + '' + j)] = item
        }
      }
      this.backupSoduArr = this.soduArr.slice()
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      this.reCreate()
    }
  }

  reCreate() {
    this.createSoduArr()
  }
  newGame() {
    this.createSoduArr()
    this.createBlank(10)
    this.createSoduEdit()
  }

  createBlank(num: number) {
    // 生成指定数量的空白格子的坐标。
    let arr = []
    let item
    for (let a = 0; a < num; a++) {
      do {
        item = parseInt(this.numArr[this.getRandom(9) - 1] + '' + this.numArr[this.getRandom(9) - 1])
      } while (arr.indexOf(item) > -1)
      arr.push(item)
    }
    this.blankArr = arr
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
  }
  seeIfBlank(num: number) {
    return this.blankArr.indexOf(num) == -1
  }

  creatThird(i: number, j: number) {
    // 为对角线上的三个三宫格随机生成。
    let sortedNumArr = this.numArr.slice().sort(function () {
      return Math.random() > 0.5 ? -1 : 1
    })
    let centerNum = parseInt(i + '' + j)
    /***********
     * 11 12 13
     * 21 22 23
     * 31 32 33
     ***********/
    let thIndexArr = [
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
  getYArr(j: number, dataArr: Array < number > ) {
    let arr = []
    for (let a = 1; a <= 9; a++) {
      if (dataArr[parseInt(a + '' + j)]) {
        arr.push(dataArr[parseInt(a + '' + j)])
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
  getXArr(i: number, dataArr: Array < number > ) {
    let arr = []
    for (let a = 1; a <= 9; a++) {
      if (dataArr[parseInt(i + '' + a)]) {
        arr.push(dataArr[parseInt(i + '' + a)])
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
  getThArr(i: number, j: number, dataArr: Array < number > ) {
    let arr = []
    let centerNum = this.getTh(i, j)
    let thIndexArr = [
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
    let cenArr = [22, 25, 28, 52, 55, 58, 82, 85, 88]
    // i为0 1 2 j逢3进1 0-8
    let index = (Math.ceil(i / 3) - 1) * 3 + Math.ceil(j / 3) - 1
    let centerNum = cenArr[index]
    return centerNum
  }
  // 两个简单数组的并集
  getConnect(arr1: Array < number > , arr2: Array < number > ) {
    let resArr = arr2.slice()
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) < 0) {
        resArr.push(arr1[i])
      }
    }
    return resArr
  }
  // 两个简单数组差集，arr1为大数组
  arrMinus(arr1: Array < number > , arr2: Array < number > ) {
    let resArr: Array < number > = []
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) < 0) {
        resArr.push(arr1[i])
      }
    }
    return resArr
  }
  // 生成随机正整数
  getRandom(n: number) {
    return Math.floor(Math.random() * n + 1)
  }
}