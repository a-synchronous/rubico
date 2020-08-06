const timeInLoop = require('./timeInLoop')
const find = require('./find')
const R = require('ramda')
const _ = require('lodash')

const gt0 = x => x > 0

// 3.636ms
timeInLoop('gt0', 1e6, () => { gt0(1) })

const array = [1, 2, 3]

// 6.417ms
timeInLoop('gt0_Array.prototype.find', 1e6, () => { array.find(gt0) })

const findHappy = find(gt0)

// 55.018ms
timeInLoop('gt0_findHappyPath', 1e6, () => { findHappy(array) })

// 93.053ms
timeInLoop('gt0_findRamdaHappyPath', 1e6, () => { R.find(gt0, array) })

// 323.106ms
timeInLoop('gt0_findLodashHappyPath', 1e6, () => { _.find(gt0, array) })

// 153.906ms
timeInLoop('gt0_findFullInit', 1e6, () => { find(gt0)(array) })

// 365.532ms
timeInLoop('gt0_findRamdaFullInit', 1e6, () => { R.find(gt0)(array) })

const object = { a: 1, b: 2, c: 3 }

// 262.711ms
timeInLoop('gt0_findObjectHappyPath', 1e6, () => { find(gt0)(object) })
