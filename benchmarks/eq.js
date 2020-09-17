const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name eq
 *
 * @benchmark
 * rubico.eq(0, 0): 1e+7: 12.706ms
 * _.eq(0, 0): 1e+7: 12.987ms
 * R.equals(0, 0): 1e+7: 196.767ms
 */

const rubicoEq = rubico.eq(0, 0)

// timeInLoop('rubico.eq(0, 0)', 1e7, () => rubicoEq(0, 0))

// timeInLoop('_.eq(0, 0)', 1e7, () => _.eq(0, 0))

// timeInLoop('R.equals(0, 0)', 1e7, () => R.equals(0, 0))
