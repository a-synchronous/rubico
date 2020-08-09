const timeInLoop = require('../x/timeInLoop')
const first = require('./first')
const _ = require('lodash')
const R = require('ramda')

const arr = [1, 2, 3]

/**
 * @name first
 *
 * @benchmark
 * first(arr): 1e+6: 10.082ms
 * _.head(arr): 1e+6: 5.361ms
 * R.first(arr): 1e+6: 198.225ms
 */

// timeInLoop('first(arr)', 1e6, () => first(arr))

const _head = _.head

// timeInLoop('_.head(arr)', 1e6, () => _head(arr))

const RFirst = R.head

// timeInLoop('R.first(arr)', 1e6, () => RFirst(arr))
