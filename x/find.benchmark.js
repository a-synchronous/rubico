const timeInLoop = require('./timeInLoop')
const find = require('./find')
const R = require('ramda')
const _ = require('lodash')

/**
 * @name find
 *
 * @benchmark
 * gt0: 1e+6: 3.586ms
 * gt0_Array.prototype.find: 1e+6: 6.53ms
 * gt0_find: 1e+6: 48.706ms
 * gt0_findRamdaHappyPath: 1e+6: 92.908ms
 * gt0_findLodashHappyPath: 1e+6: 314.244ms
 */

const gt0 = x => x > 0

// timeInLoop('gt0', 1e6, () => { gt0(1) })

const array = [1, 2, 3]

// timeInLoop('gt0_Array.prototype.find', 1e6, () => { array.find(gt0) })

const findHappy = find(gt0)

// timeInLoop('gt0_find', 1e6, () => { findHappy(array) })

// timeInLoop('gt0_findRamdaHappyPath', 1e6, () => { R.find(gt0, array) })

// timeInLoop('gt0_findLodashHappyPath', 1e6, () => { _.find(gt0, array) })
