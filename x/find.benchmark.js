const timeInLoop = require('./timeInLoop')
const find = require('./find')
const R = require('ramda')

const gt0 = x => x > 0

// 3.607ms
timeInLoop('gt0', 1e6, () => {
  gt0(1)
})

const array = [1, 2, 3]

// 12.539ms
timeInLoop('gt0_Array.prototype.find', 1e6, () => {
  array.find(gt0)
})

const findHappy = find(gt0)

// 86.023ms
timeInLoop('gt0_findHappyPath', 1e6, () => {
  findHappy(array)
})

// 101.791ms
timeInLoop('gt0_findRamdaHappyPath', 1e6, () => {
  R.find(gt0, array)
})

// 145.28ms
timeInLoop('gt0_findFullInit', 1e6, () => {
  find(gt0)(array)
})

// 375.694ms
timeInLoop('gt0_findRamdaFullInit', 1e6, () => {
  R.find(gt0)(array)
})

const object = { a: 1, b: 2, c: 3 }

// 654.661ms
timeInLoop('gt0_findObjectHappyPath', 1e6, () => {
  find(gt0)(object)
})
