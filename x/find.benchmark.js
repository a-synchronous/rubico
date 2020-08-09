const timeInLoop = require('./timeInLoop')
const find = require('./find')
const R = require('ramda')
const _ = require('lodash')

/**
 * @name find
 *
 * @benchmark
 * gt0: 1e+7: 12.394ms
 * gt0_Array.prototype.find: 1e+7: 32.779ms
 * gt0_findHappyPath: 1e+7: 337.765ms
 * gt0_findRamdaHappyPath: 1e+7: 787.56ms
 * gt0_findLodashHappyPath: 1e+7: 2.874s
 */

const gt0 = x => x > 0

// timeInLoop('gt0', 1e7, () => { gt0(1) })

const array = [1, 2, 3]

// timeInLoop('gt0_Array.prototype.find', 1e7, () => { array.find(gt0) })

const findHappy = find(gt0)

// timeInLoop('gt0_find', 1e7, () => { findHappy(array) })

// timeInLoop('gt0_findRamdaHappyPath', 1e7, () => { R.find(gt0, array) })

// timeInLoop('gt0_findLodashHappyPath', 1e7, () => { _.find(gt0, array) })
