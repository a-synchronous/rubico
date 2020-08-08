const timeInLoop = require('./timeInLoop')
const isEmpty = require('./isEmpty')
const _ = require('lodash')
const R = require('ramda')

/**
 * @name isEmpty
 *
 * @synopsis
 * isEmpty(value any) -> boolean
 *
 * @benchmark
 * _.isEmpty([]): 1e+6: 70.592ms
 * isEmpty([]): 1e+6: 21.695ms
 * R.isEmpty([]): 1e+6: 3.343s
 */

// timeInLoop('_.isEmpty([])', 1e6, () => _.isEmpty([]))

// timeInLoop('isEmpty([])', 1e6, () => isEmpty([]))

// timeInLoop('R.isEmpty([])', 1e6, () => R.isEmpty([]))
