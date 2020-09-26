const timeInLoop = require('./timeInLoop')
const _ = require('lodash')
const size = require('./size')
const R = require('ramda')

/**
 * @name size
 *
 * @benchmark
 * array.length: 1e+7: 12.207ms
 * size(array): 1e+7: 12.931ms
 * _.size(array): 1e+7: 581.128ms
 * R.length(array): 1e+7: 1.887s
 */

const array = [1, 2, 3, 4, 5]

const _size = _.size

const RLength = R.length

// timeInLoop('array.length', 1e7, () => array.length)

// timeInLoop('size(array)', 1e7, () => size(array))

// timeInLoop('_.size(array)', 1e7, () => _size(array))

// timeInLoop('R.length(array)', 1e7, () => RLength(array))
