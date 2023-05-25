const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name eq
 *
 * @benchmark
 * rubico.eq(0, 0): 1e+7: 12.499ms
 * _.eq(0, 0): 1e+7: 12.585ms
 * R.equals(0, 0): 1e+7: 196.767ms
 */

const rubicoEq = rubico.eq(0, 0)

// console.log(rubicoEq())
// console.log(_.eq(0, 0))
// console.log(R.equals(0, 0))

// timeInLoop('rubico.eq(0, 0)', 1e7, () => rubicoEq())

// timeInLoop('_.eq(0, 0)', 1e7, () => _.eq(0, 0))

// timeInLoop('R.equals(0, 0)', 1e7, () => R.equals(0, 0))
