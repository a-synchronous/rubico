const timeInLoop = require('./timeInLoop')
const _ = require('lodash')
const size = require('./size')
const R = require('ramda')

/**
 * @name size
 *
 * @benchmark
 * array.length: 1e+6: 3.543ms
 * size(array): 1e+6: 7.058ms
 * _.size(array): 1e+6: 67.073ms
 * R.length(array): 1e+6: 203.822ms
 */

const array = [1, 2, 3, 4, 5]

const _size = _.size

const RLength = R.length

// timeInLoop('array.length', 1e6, () => array.length)

// timeInLoop('size(array)', 1e6, () => size(array))

// timeInLoop('_.size(array)', 1e6, () => _size(array))

// timeInLoop('R.length(array)', 1e6, () => RLength(array))
