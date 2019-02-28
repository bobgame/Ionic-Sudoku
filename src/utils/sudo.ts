export function CreateSudoArr() {
  let sudoArr = []
  const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  createSudo()
  function createSudo() {
    try {
      sudoArr = []
      creatThird(2, 8)
      creatThird(5, 5)
      creatThird(8, 2)
      // console.log(sudoArr)
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          if (sudoArr[i * 10 + j]) {
            continue
          }
          const XArr = getXArr(i, sudoArr)
          const YArr = getYArr(j, sudoArr)
          const thArr = getThArr(i, j, sudoArr)
          const arr = getConnect(getConnect(XArr, YArr), thArr)
          const ableArr = arrMinus(numArr, arr)
          if (ableArr.length === 0) {
            createSudo()
            return
          }

          let item: number
          // 如果生成的重复了就重新生成，这里只是以防万一的做法。
          do {
            item = ableArr[getRandom(ableArr.length) - 1]
          } while ((arr.indexOf(item) > -1))

          sudoArr[i * 10 + j] = item
        }
      }
      return sudoArr
    } catch (e) {
      // 如果因为超出浏览器的栈限制出错，就重新运行。
      createSudo()
    }
  }
  function reCreate() {
    createSudo()
  }
  function creatThird(i: number, j: number) {
    // 为对角线上的三个三宫格随机生成。
    const sortedNumArr = numArr.slice().sort(function () {
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
  function getYArr(j: number, dataArr: Array<number>) {
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
  function getXArr(i: number, dataArr: Array<number>) {
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
  function getThArr(i: number, j: number, dataArr: Array<number>) {
    const arr = []
    const centerNum = getTh(i, j)
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
  function getTh(i: number, j: number) {
    const cenArr = [22, 25, 28, 52, 55, 58, 82, 85, 88]
    // i为0 1 2 j逢3进1 0-8
    const index = (Math.ceil(i / 3) - 1) * 3 + Math.ceil(j / 3) - 1
    const centerNum = cenArr[index]
    return centerNum
  }

  // 两个简单数组的并集
  function getConnect(arr1: Array<number>, arr2: Array<number>) {
    const resArr = arr2.slice()
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) < 0) {
        resArr.push(arr1[i])
      }
    }
    return resArr
  }

  // 生成随机正整数
  function getRandom(n: number): number {
    return Math.floor(Math.random() * n + 1)
  }

  // 两个简单数组差集，arr1为大数组
  function arrMinus(arr1: Array<number>, arr2: Array<number>) {
    const resArr: Array<number> = []
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) < 0) {
        resArr.push(arr1[i])
      }
    }
    return resArr
  }
}

