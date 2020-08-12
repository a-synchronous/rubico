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

const _head = _.head

const RFirst = R.head

// timeInLoop('first(arr)', 1e7, () => first(arr))

// timeInLoop('_.head(arr)', 1e7, () => _head(arr))

// timeInLoop('R.first(arr)', 1e7, () => RFirst(arr))
