const timeInLoop = require('../x/timeInLoop')
const first = require('./first')
const _ = require('lodash')
const R = require('ramda')

const arr = [1, 2, 3]

/**
 * @name first
 *
 * @benchmark
 * first(arr): 1e+7: 12.698ms
 * _.head(arr): 1e+7: 23.017ms
 * R.first(arr): 1e+7: 1.903s
 */

// timeInLoop('first(arr)', 1e7, () => first(arr))

const _head = _.head

// timeInLoop('_.head(arr)', 1e7, () => _head(arr))

const RFirst = R.head

// timeInLoop('R.first(arr)', 1e7, () => RFirst(arr))
