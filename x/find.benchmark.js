const timeInLoop = require('./timeInLoop')
const find = require('./find')
const R = require('ramda')

const gt0 = x => x > 0

timeInLoop('gt0', 1e6, () => {
  gt0(1)
})

const array = [1, 2, 3]

timeInLoop('gt0_Array.prototype.find', 1e6, () => {
  array.find(gt0)
})

const findHappy = find(gt0)

timeInLoop('gt0_findHappyPath', 1e6, () => {
  findHappy(array)
})

const findHappyRamda = R.find(gt0)

timeInLoop('gt0_findRamdaHappyPath', 1e6, () => {
  findHappyRamda(array)
})

timeInLoop('gt0_findFullInit', 1e6, () => {
  find(gt0)(array)
})

timeInLoop('gt0_findRamdaFullInit', 1e6, () => {
  R.find(gt0)(array)
})

const object = { a: 1, b: 2, c: 3 }

timeInLoop('gt0_findObjectHappyPath', 1e6, () => {
  find(gt0)(object)
})
